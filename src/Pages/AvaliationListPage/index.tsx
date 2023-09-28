// Libraries
import { useState, CSSProperties, ReactNode, useEffect } from "react";
import { DcpButton } from "@codecompanybrasil/discipline-core";

// General Components
import Header from "@/Layouts/Header"
import Pagination from "@/Components/Pagination"
// import { Enem, Mit, Obmep } from "../../../Components/DcpIcons/Icon";

// Local Components
import AvaliationListHeader from "./Header"
import AvaliationListItem from "./ListItem"
import Filters from "./Filters";

// Styles and Images
import styles from './page.module.css'
import PageTemplate from "@/Layouts/PageTemplate";

// Types and Interfaces
export interface Avaliation {
    hash: string,
    title: string,
    year: number,
    icon?: string
}

function AvaliationListPage() {
    const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null) //Váriavel que diz qual Query tem o menu aberto
    const [avaliacaoStyle, setAvaliacaoStyle] = useState(styles.avaliacao)
    const [filterStyle, setFilterStyle] = useState(styles.filter_area)
    const [resData, setResData] = useState<{ data: Avaliation[], total: number }>()
    const [itemsPerPage, setItemsPerPage] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(true)
    const [urlAPI, setUrlAPI] = useState<URL>(new URL(`${process.env.REACT_APP_API_URL}/avaliations?offset=0&limit=${itemsPerPage}`))

    const fetchingAPI = () => {
        fetch(urlAPI)
            .then(async (response) => {
                if (response.ok) {
                    const resData = await response.json()
                    setResData(resData)
                }
            })
            .catch((error) => {
                console.error(error)
                setResData({ data: [], total: 0 })
            })
    }

    useEffect(() => fetchingAPI(), [])

    useEffect(() => {
        console.log("Data changed", resData)
    }, [resData])

    const onMenuClick = () => {
        if (avaliacaoStyle === styles.avaliacao) { //Deve abrir o filtro
            setAvaliacaoStyle(`${styles.avaliacao} ${styles.filter_open}`)
            setFilterStyle(`${styles.filter_area} ${styles.filter_area_opened}`)
        } else { // Deve fechar o filtro
            setAvaliacaoStyle(styles.avaliacao)
            setFilterStyle(`${styles.filter_area} ${styles.filter_area_closed}`)
        }
    }

    const handleSetActiveMenuIndex = (menu: number | null) => {
        setActiveMenuIndex(menu)
    }

    const handleUrlAPI = (url: URL) => {
        setUrlAPI(url)
        fetchingAPI()
        console.log(`Fetching: ${urlAPI.href}`)
    }

    const updateList = (page: number) => {
        urlAPI.searchParams.set("offset", String((page === 1) ? 0 : (itemsPerPage * (page - 1))))
        fetchingAPI()
    }

    return (
        <PageTemplate>
            <PageTemplate.Header title="Avaliações" />
            <PageTemplate.Panel>
                <div className={filterStyle}>
                    <Filters onMenuClick={onMenuClick} handleUrlAPI={handleUrlAPI} urlAPI={urlAPI} />
                </div>
                <div className={avaliacaoStyle}>
                    <AvaliationListHeader onClick={onMenuClick} />
                    <div className={styles.querys_avaliacao} >
                        {resData?.total === 0 ? (
                            <p className={styles.sem_resultados}>Sem resultados</p>
                        ) : (resData?.data.map((item, index) => (
                            <AvaliationListItem
                                key={index}
                                index={index}
                                hash={item.hash}
                                link={`/avaliacoes/${item.hash}`}
                                title={item.title}
                                iconPath={item.icon}
                                setActiveMenuIndex={handleSetActiveMenuIndex}
                                activeMenuIndex={activeMenuIndex}
                            />
                        )))}
                    </div>
                    {resData?.total && (resData.total > 1) &&
                        <Pagination
                            totalPages={resData?.total ?? 1}
                            onPaginate={updateList} />
                    }
                </div>
                {/* <div className="w-100 d-flex justify-content-center mt-5">
                <DcpButton tag='a' text="Resolver Avaliações" href="/abrir-avaliacao" color="accent" />
            </div> */}
            </PageTemplate.Panel>
        </PageTemplate>


    );
}

export default AvaliationListPage;