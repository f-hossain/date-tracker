import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/database.types'

export default function AuthForm() {
  const supabase = createClientComponentClient<Database>()
  const hostUrl = process.env['NEXT_PUBLIC_HOST']
  const callbackUrl = `${hostUrl}/auth/callback`

  return (
    <Auth
      supabaseClient={supabase}
      view="magic_link"
      theme="default"
      appearance={{
        theme: ThemeSupa,
        variables: {
          default: {
            colors: {
              brand: '#f2aba5',
              brandAccent: 'rgb(244, 187, 183)',
              inputBorder: 'lightgray',
              inputBorderHover: '#F9E7E7',
              inputBorderFocus: '#F9E7E7',
              messageText: '#666A3C',
              messageBackground: '#EEF4ED',
              messageBorder: '#EEF4ED',
              messageTextDanger: '#A74242',
              messageBackgroundDanger: '#FDF1F2',
              messageBorderDanger: '#FDF1F2',
            },
            space: {
                spaceSmall: '2px',
                spaceMedium: '4px',
                spaceLarge: '8px',
            },
            fontSizes: {
                baseBodySize: '12px',
                baseInputSize: '12px',
                baseLabelSize: '12px',
                baseButtonSize: '12px',
            }
          },
        },
      }}
      localization={{
        variables: {
          magic_link: {
            email_input_label: '',
            email_input_placeholder: 'email address',
            button_label: 'send magic link',
            loading_button_label: 'sending...',
            confirmation_text: 'check email for magic link!'
          },
        },
      }}
      showLinks={false}
      providers={[]}
      // TODO: REMOVE LATER - HARDCODING AS A TEST 
      redirectTo={callbackUrl}
    />
  )
}