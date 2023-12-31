// scroll bar
import 'simplebar/src/simplebar.css'

// lightbox
import 'react-image-lightbox/style.css'

// map
import 'mapbox-gl/dist/mapbox-gl.css'

// editor
import 'react-quill/dist/quill.snow.css'

// slick-carousel
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'

// lazy image
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { ptBR } from 'date-fns/locale'
import 'react-lazy-load-image-component/src/effects/blur.css'

// ----------------------------------------------------------------------

import { CacheProvider, EmotionCache } from '@emotion/react'
// next
import { NextPage } from 'next'
import { AppProps } from 'next/app'
import Head from 'next/head'
// utils
import createEmotionCache from '../utils/createEmotionCache'
// theme
import ThemeProvider from '../theme'
// components
import { MotionLazyContainer } from '../components/animate'
import { StyledChart } from '../components/chart'
import ProgressBar from '../components/progress-bar'
import { SettingsProvider, ThemeSettings } from '../components/settings'
import SnackbarProvider from '../components/snackbar'

// Check our docs
// https://docs.minimals.cc/authentication/ts-version

import { StorageProvider } from 'src/storage/StorageContext'
import { AuthProvider } from '../auth/JwtContext'

// ----------------------------------------------------------------------

const clientSideEmotionCache = createEmotionCache()

type NextPageWithLayout = NextPage & {
    getLayout?: (page: React.ReactElement) => React.ReactNode
}

interface MyAppProps extends AppProps {
    emotionCache?: EmotionCache
    Component: NextPageWithLayout
}

export default function MyApp(props: MyAppProps) {
    const { Component, pageProps, emotionCache = clientSideEmotionCache } = props

    const getLayout = Component.getLayout ?? (page => page)

    return (
        <CacheProvider value={emotionCache}>
            <Head>
                <meta name="viewport" content="initial-scale=1, width=device-width" />
            </Head>

            <AuthProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={ptBR}>
                    <StorageProvider>
                        <SettingsProvider>
                            <MotionLazyContainer>
                                <ThemeProvider>
                                    <ThemeSettings>
                                        <SnackbarProvider>
                                            <StyledChart />
                                            <ProgressBar />
                                            {getLayout(<Component {...pageProps} />)}
                                        </SnackbarProvider>
                                    </ThemeSettings>
                                </ThemeProvider>
                            </MotionLazyContainer>
                        </SettingsProvider>
                    </StorageProvider>
                </LocalizationProvider>
            </AuthProvider>
        </CacheProvider>
    )
}
