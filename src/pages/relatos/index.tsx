// next
import Head from 'next/head'
// @mui
import { Card, Container, Grid } from '@mui/material'
import moment from 'moment'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAuthContext } from 'src/auth/useAuthContext'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import LoadingScreen from 'src/components/loading-screen/LoadingScreen'
import { useSettingsContext } from 'src/components/settings'
import DashboardLayout from 'src/layouts/dashboard'
import CrudTable from 'src/sections/@dashboard/general/app/CrudTable'
import { IPostListing } from 'types/IPostListing'
import { PostController } from '../../../controllers/postController'

// ----------------------------------------------------------------------

ReportsListing.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>

// ----------------------------------------------------------------------

export default function ReportsListing() {
    const router = useRouter()
    const { themeStretch } = useSettingsContext()

    function convertStatusText(text) {
        switch (text) {
            case 'em_progresso':
                return 'Em progresso'
            case 'novo':
                return 'Novo'
            case 'concluido_procedente':
                return 'Concluído Procedente'
            case 'concluido_improcedente':
                return 'Concluído Improcedente'
            case 'cancelado':
                return 'Cancelado'
            default:
                return text
        }
    }

    const [loading, setLoading] = useState(false)
    const [posts, setPosts] = useState<IPostListing[]>([])

    const getPosts = async () => {
        setLoading(true)
        const postController = new PostController()

        try {
            const postsData = await postController.getAll()
            postsData?.forEach(item => {
                item.createdAt = moment(item.createdAt).format('DD/MM/YYYY')
                item.company = item.tenant.description
                item.type = item.response['tipo-denuncia'].label
                item.status = convertStatusText(item.status)
                if (item.postcloseds.length > 0) {
                    item.date_closed = item.postcloseds[0].date_close
                        ? moment(item.postcloseds[0].date_close).format('DD/MM/YYYY')
                        : '--'
                } else {
                    item.date_closed = '--'
                }
                switch (item.sensibilidade) {
                    case 'alta':
                        item.sensibilidadeNum = 3
                        break
                    case 'media':
                        item.sensibilidadeNum = 2
                        break
                    case 'baixa':
                        item.sensibilidadeNum = 1
                        break
                }
            })
            postsData.sort(function compareFn(a, b) {
                if (a.sensibilidadeNum < b.sensibilidadeNum) {
                    return 1
                } else if (a.sensibilidadeNum > b.sensibilidadeNum) {
                    return -1
                }
                return 0
            })
            setPosts(postsData)
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }

    const { tenantId } = useAuthContext()

    useEffect(() => {
        getPosts()
    }, [tenantId])

    return (
        <>
            <Card sx={{ height: '100%', px: '1%', py: '18px' }}>
                <Head>
                    <title>Relatos</title>
                </Head>
                {loading && <LoadingScreen />}
                <Container maxWidth={themeStretch ? false : 'xl'}>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <HeaderBreadcrumbs
                                heading={'Relatos'}
                                links={[
                                    {
                                        name: 'Relatos',
                                        href: '/relatos',
                                    },
                                    { name: 'Lista' },
                                ]}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            {/* <AccordionFilter
                                schemaForm={BusinessFilterFormSchema}
                                setFilters={handleSetBusinessFilters}
                                formData={businessFilters}
                            /> */}
                        </Grid>

                        <Grid item xs={12}>
                            <CrudTable
                                editPagePath="/detalhes/"
                                tableData={posts}
                                setTableData={setPosts}
                                clickableRow
                                colorfulstatus
                                tableLabels={[
                                    { id: 'email', label: 'Email' },
                                    { id: 'createdAt', label: 'Data Criação' },
                                    { id: 'status', label: 'Status' },
                                    { id: 'type', label: 'Tipo de denúncia' },
                                    { id: 'date_closed', label: 'Data Fechamento' },
                                    { id: 'sensibilidade', label: 'Sensibilidade' },
                                ]}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Card>
        </>
    )
}
