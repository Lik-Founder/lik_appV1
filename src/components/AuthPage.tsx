import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import { Eye, EyeOff, ArrowLeft } from '@phosphor-icons/react'
import LikLogo from '@/assets/images/Lik_Logo_Heart_1.0.png'

interface AuthPageProps {
  onBack: () => void
}

export function AuthPage({ onBack }: AuthPageProps) {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  })
  
  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    username: ''
  })

  const { signIn, signUp, signInWithProvider } = useAuth()

  // Check if we're in mock mode
  const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
    import.meta.env.VITE_SUPABASE_ANON_KEY !== 'placeholder_anon_key'

  const handleDevSkip = () => {
    toast.info('Skipping authentication in development mode')
    onBack()
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()

    // Allow bypass login with empty credentials
    if (!signInData.email && !signInData.password) {
      setLoading(true)
      try {
        await signIn('', '')
        toast.success('Welcome to Lik! (Guest Mode)')
        onBack()
      } catch (error: any) {
        toast.error(error.message || 'Failed to sign in')
      } finally {
        setLoading(false)
      }
      return
    }

    if (!signInData.email || !signInData.password) {
      toast.error('Please fill in all fields or leave both empty to continue as guest')
      return
    }

    setLoading(true)
    try {
      await signIn(signInData.email, signInData.password)
      toast.success('Welcome back!')
      onBack()
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!signUpData.email || !signUpData.password || !signUpData.confirmPassword) {
      toast.error('Please fill in all fields')
      return
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (signUpData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      await signUp(signUpData.email, signUpData.password, {
        display_name: signUpData.displayName,
        username: signUpData.username
      })
      toast.success('Check your email to confirm your account!')
      setActiveTab('signin')
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign up')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignIn = async (provider: 'google' | 'github' | 'discord') => {
    try {
      await signInWithProvider(provider)
    } catch (error: any) {
      toast.error(error.message || `Failed to sign in with ${provider}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mr-3"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center space-x-2">
            <img 
              src={LikLogo} 
              alt="Lik" 
              className="w-8 h-8"
            />
            <h1 className="text-2xl font-bold text-foreground nav-rum-raisin">Lik</h1>
          </div>
        </div>

        <Card className="backdrop-blur-sm bg-white/90 border-pink-200 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl nav-rum-raisin">
              {activeTab === 'signin' ? 'Welcome Back' : 'Join Lik'}
            </CardTitle>
            <CardDescription>
              {activeTab === 'signin' 
                ? 'Sign in to continue your food discovery journey' 
                : 'Start your gamified food adventure'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'signin' | 'signup')}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-blue-700">
                      💡 <strong>Quick Start:</strong> Leave both fields empty and click "Sign In" to continue as a guest
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email (or leave empty for guest mode)"
                      value={signInData.email}
                      onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password (or leave empty for guest mode)"
                        value={signInData.password}
                        onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
                        disabled={loading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90" 
                    disabled={loading}
                  >
                    {loading ? 'Signing In...' : (signInData.email || signInData.password ? 'Sign In' : 'Continue as Guest')}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-display-name">Display Name</Label>
                      <Input
                        id="signup-display-name"
                        placeholder="Your name"
                        value={signUpData.displayName}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, displayName: e.target.value }))}
                        disabled={loading}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-username">Username</Label>
                      <Input
                        id="signup-username"
                        placeholder="@username"
                        value={signUpData.username}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, username: e.target.value }))}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={signUpData.password}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                        disabled={loading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                    <Input
                      id="signup-confirm-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={signUpData.confirmPassword}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      disabled={loading}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90" 
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => handleOAuthSignIn('google')}
                  disabled={loading}
                  className="w-full"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => handleOAuthSignIn('github')}
                  disabled={loading}
                  className="w-full"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => handleOAuthSignIn('discord')}
                  disabled={loading}
                  className="w-full"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0188 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9460 2.4189-2.1568 2.4189Z"/>
                  </svg>
                </Button>
              </div>
            </div>

            {/* Development Mode Skip Button */}
            {!isSupabaseConfigured && (
              <div className="mt-6 pt-6 border-t border-border">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    Supabase not configured - Development Mode
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleDevSkip}
                    className="w-full border-amber-200 text-amber-700 hover:bg-amber-50"
                  >
                    Skip Authentication (Dev Mode)
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}