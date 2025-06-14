
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user?.email) {
      throw new Error("User not authenticated");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Get user's Stripe customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      // No customer found, update as free user
      await supabaseClient.from("profiles").update({
        plan: "free",
        credits: 10,
        max_file_size: 524288000 // 500MB
      }).eq("id", user.id);

      return new Response(JSON.stringify({ 
        subscribed: false, 
        plan: "free",
        credits: 10 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const customerId = customers.data[0].id;
    
    // Check for active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    const hasActiveSub = subscriptions.data.length > 0;
    let subscriptionData = null;

    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      subscriptionData = {
        stripe_subscription_id: subscription.id,
        status: "active",
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
      };

      // Update user to PRO
      await supabaseClient.from("profiles").update({
        plan: "pro",
        credits: 1000, // PRO users get 1000 credits
        max_file_size: 5368709120 // 5GB
      }).eq("id", user.id);

      // Update subscription record
      await supabaseClient.from("subscriptions").upsert({
        user_id: user.id,
        stripe_customer_id: customerId,
        ...subscriptionData,
        plan_name: "pro"
      });
    } else {
      // Update user to free
      await supabaseClient.from("profiles").update({
        plan: "free",
        credits: 10,
        max_file_size: 524288000 // 500MB
      }).eq("id", user.id);

      await supabaseClient.from("subscriptions").upsert({
        user_id: user.id,
        stripe_customer_id: customerId,
        status: "inactive",
        plan_name: "free"
      });
    }

    // Get updated profile
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    return new Response(JSON.stringify({
      subscribed: hasActiveSub,
      plan: profile?.plan || "free",
      credits: profile?.credits || 10,
      maxFileSize: profile?.max_file_size || 524288000
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error checking subscription:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
