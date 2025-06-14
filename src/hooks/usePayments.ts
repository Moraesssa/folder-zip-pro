
import { useState } from 'react';
import { useAuth, supabase } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const usePayments = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, checkSubscription } = useAuth();
  const { toast } = useToast();

  const createCheckoutSession = async () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para assinar o plano PRO",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout');
      
      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Erro no checkout",
        description: error.message || "Não foi possível iniciar o processo de pagamento",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openCustomerPortal = async () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para gerenciar sua assinatura",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Erro ao abrir portal",
        description: error.message || "Não foi possível abrir o portal do cliente",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSubscription = async () => {
    setIsLoading(true);
    try {
      await checkSubscription();
      toast({
        title: "Status atualizado",
        description: "Status da assinatura foi verificado",
      });
    } catch (error: any) {
      console.error('Error refreshing subscription:', error);
      toast({
        title: "Erro na verificação",
        description: "Não foi possível verificar o status da assinatura",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createCheckoutSession,
    openCustomerPortal,
    refreshSubscription
  };
};
