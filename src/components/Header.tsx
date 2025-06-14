
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Crown, Menu, User, LogOut, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from './LoginModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  onUpgradeClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onUpgradeClick }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <>
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-zipfast-gradient rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-zipfast-blue to-zipfast-purple bg-clip-text text-transparent">
                ZipFast
              </h1>
            </div>

            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">Créditos:</span>
                    <span className="font-semibold text-zipfast-blue">{user?.credits}</span>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        {user?.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-full" />
                        ) : (
                          <User className="w-4 h-4" />
                        )}
                        {user?.name}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <User className="w-4 h-4 mr-2" />
                        Minha Conta
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Sair
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button onClick={() => setIsLoginModalOpen(true)} variant="outline">
                  <User className="w-4 h-4 mr-2" />
                  Entrar
                </Button>
              )}
              
              <Button onClick={onUpgradeClick} className="zipfast-button">
                <Crown className="w-4 h-4 mr-2" />
                {user?.plan === 'pro' ? 'PRO' : 'Upgrade PRO'}
              </Button>
            </div>

            <div className="md:hidden">
              <Button variant="outline" size="sm">
                <Menu className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
};

export default Header;
