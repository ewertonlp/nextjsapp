import { ArticleOutlined, CalendarMonth } from '@mui/icons-material'
import CancelIcon from '@mui/icons-material/Cancel'
import DoneIcon from '@mui/icons-material/Done'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import InboxIcon from '@mui/icons-material/Inbox'
import { Card, CardContent, Container, Grid, Typography } from '@mui/material'
import { PostController } from 'controllers/postController'
import Head from 'next/head'
import Link from 'next/link'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { useAuthContext } from 'src/auth/useAuthContext'
import LoadingScreen from 'src/components/loading-screen'
import { useSettingsContext } from 'src/components/settings'
import DashboardLayout from 'src/layouts/dashboard'

const reportData = [
    { title: 'Total de relatos', Icon: InboxIcon },
    { title: 'Relatos abertos no mês atual', Icon: CalendarMonth },
    { title: 'Novos', Icon: ArticleOutlined },
    { title: 'Em andamento', Icon: HourglassEmptyIcon },
    { title: 'Finalizado procedente', Icon: DoneIcon },
    { title: 'Finalizado improcedente', Icon: CancelIcon },
]

const Relatorios = ({ data = reportData, selectedReportStatus }) => {
    const { themeStretch } = useSettingsContext()

    const { enqueueSnackbar } = useSnackbar()
    const { tenantId } = useAuthContext()

    const [loading, setLoading] = useState(true)

    const [reportNumbers, setReportNumbers] = useState({
        'Total de relatos': '-',
        'Relatos abertos no mês atual': '-',
        Novos: '-',
        'Em andamento': '-',
        'Finalizado procedente': '-',
        'Finalizado improcedente': '-',
    })

    // const getData = async (statusRelato) => {
    //     setLoading(true)
    //     const postController = new PostController()
    //     try {
    //         let count = 0
    //         if (statusRelato.status === 'Total de relatos') {
    //             count = await postController.getAllYear()
    //         } else if (statusRelato.status === 'Relatos abertos no mês atual') {
    //             count = await postController.getAllMonth()
    //         } else if (statusRelato.status === 'Novos') {
    //             count = await postController.getAllNovo()
    //         } else if (statusRelato.status === 'Em andamento') {
    //             count = await postController.getAllEmProgresso()
    //         } else if (statusRelato.status === 'Finalizado procedente') {
    //             count = await postController.getAllConcluidoProcedente()
    //         } else if (statusRelato.status === 'Finalizado improcedente') {
    //             count = await postController.getAllConcluidoImprocedente()
    //         }
    //         setReportNumbers(prev => ({ ...prev, [statusRelato]: count.toString() }))
    //     } catch (error) {
    //         enqueueSnackbar('Ops! Erro ao recuperar dados do relatório', { autoHideDuration: 5000 })
    //     }
    //     setLoading(false)
    // }
    // const router = useRouter()
    // const {status} = router.query

    const getData = async () => {
        setLoading(true)
        const postController = new PostController()
        try {
            let count = await postController.getAllYear()
            setReportNumbers(prev => ({ ...prev, 'Total de relatos': count.toString() }))

            count = await postController.getAllMonth()
            console.log(count)
            setReportNumbers(prev => ({ ...prev, 'Relatos abertos no mês atual': count.toString() }))

            count = await postController.getAllNovo()
            setReportNumbers(prev => ({ ...prev, Novos: count.toString() }))

            count = await postController.getAllEmProgresso()
            setReportNumbers(prev => ({ ...prev, 'Em andamento': count.toString() }))

            count = await postController.getAllConcluidoProcedente()
            setReportNumbers(prev => ({ ...prev, 'Finalizado procedente': count.toString() }))

            count = await postController.getAllConcluidoImprocedente()
            setReportNumbers(prev => ({ ...prev, 'Finalizado improcedente': count.toString() }))
        } catch (error) {
            enqueueSnackbar('Ops! Erro ao recuperar dados do relatório', { autoHideDuration: 5000 })
        }
        setLoading(false)
    }

    useEffect(() => {
        getData()
    }, [tenantId])

    return (
        <>
            <Head>
                <title>Relatórios</title>
            </Head>
            <Typography variant="h4" sx={{ margin: '25px' }}>
                Relatórios
            </Typography>
            {loading && <LoadingScreen />}
            <Container sx={{ marginTop: '40px' }} maxWidth={themeStretch ? false : 'xl'}>
                <Grid
                    container
                    display="flex"
                    justifyContent="space-around"
                    rowGap={{ xs: '15px', lg: '25px' }}
                    spacing={2}
                >
                    {data.map((report, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={6} xl={4} key={index}>
                            <Link href={`/relatos?status=${report.title}`}>
                                <Card
                                    sx={{
                                        minWidth: 275,
                                        alignItems: 'center',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <report.Icon
                                        style={{
                                            fontSize: 40,
                                            marginTop: '20px',
                                            marginBottom: '-16px',
                                            color: '#7eb353',
                                        }}
                                    />
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Typography
                                            sx={{ marginBottom: '16px', color: 'gray' }}
                                            variant="h5"
                                            component="div"
                                        >
                                            {report.title}
                                        </Typography>
                                        <Typography sx={{ fontSize: '24px', color: '#7eb353' }} variant="body2">
                                            {reportNumbers[report.title]}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Link>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </>
    )
}

Relatorios.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>

export default Relatorios