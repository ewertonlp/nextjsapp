// next
import Head from 'next/head'
// auth
import GuestGuard from '../../auth/AuthGuard'
// sections
// import Login from '../../sections/auth/Login';
// import Login from '../../sections/auth/LoginAuth0';

// ----------------------------------------------------------------------

export default function LoginPage() {
    return (
        <>
            <Head>
                <title> Login</title>
            </Head>

            <GuestGuard>{/* <Login /> */}</GuestGuard>
        </>
    )
}