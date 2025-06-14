
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Crown, Menu, User, LogOut, Zap, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from './LoginModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface HeaderProps {
  onUpgradeClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onUpgradeClick }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  const handleMobileLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const handleMobileUpgrade = () => {
    onUpgradeClick();
    setIsMobileMenuOpen(false);
  };

  const handleMobileLogin = () => {
    setIsLoginModalOpen(true);
    setIsMobileMenuOpen(false);
  };

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
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Menu className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader className="text-left">
                    <SheetTitle className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-zipfast-gradient rounded-lg flex items-center justify-center">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      <span className="bg-gradient-to-r from-zipfast-blue to-zipfast-purple bg-clip-text text-transparent">
                        ZipFast
                      </span>
                    </SheetTitle>
                  </SheetHeader>
                  
                  <div className="flex flex-col gap-6 mt-8">
                    {isAuthenticated ? (
                      <>
                        {/* User Info Section */}
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                          {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                          ) : (
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-600" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900">{user?.name}</p>
                            <p className="text-sm text-gray-600">{user?.email}</p>
                          </div>
                        </div>

                        {/* Credits Section */}
                        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                          <span className="text-gray-700">Créditos Disponíveis</span>
                          <span className="font-bold text-zipfast-blue text-lg">{user?.credits}</span>
                        </div>

                        {/* Menu Items */}
                        <div className="flex flex-col gap-3">
                          <Button variant="outline" className="justify-start h-12">
                            <User className="w-4 h-4 mr-3" />
                            Minha Conta
                          </Button>
                          
                          <Button onClick={handleMobileLogout} variant="outline" className="justify-start h-12">
                            <LogOut className="w-4 h-4 mr-3" />
                            Sair
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Login Section for non-authenticated users */}
                        <div className="text-center p-6 bg-gray-50 rounded-lg">
                          <p className="text-gray-600 mb-4">Faça login para acessar todos os recursos</p>
                          <Button onClick={handleMobileLogin} className="w-full">
                            <User className="w-4 h-4 mr-2" />
                            Entrar
                          </Button>
                        </div>
                      </>
                    )}

                    {/* Upgrade PRO Button */}
                    <Button onClick={handleMobileUpgrade} className="zipfast-button h-12">
                      <Crown className="w-4 h-4 mr-2" />
                      {user?.plan === 'pro' ? 'Conta PRO Ativa' : 'Upgrade para PRO'}
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
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
