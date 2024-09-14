
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { OverlayPanel } from 'primereact/overlaypanel'
import { Skeleton } from 'primereact/skeleton'
import { useState, useEffect, useRef } from 'react'
import Pagination from './Pagination'
import down_icon from '../assets/chevron-down.svg'
import "primereact/resources/themes/lara-light-cyan/theme.css"

interface Row {
    id?: number,
    title?: string,
    place_of_origin?: string,
    artist_display?: string,
    inscriptions?: string,
    date_start?: number,
    date_end?: number
}

function Table() {

    const [loading, setLoading] = useState<boolean>(true)
    const [rows, setRows] = useState<Row[]>([])
    const [page, setPage] = useState(0)
    const [selectedRows, setSelectedRows] = useState<Row[] | null>(null)
    const [totalRecords, setTotalRecords] = useState(1)
    const [input, setInput] = useState<string>('')

    const op = useRef<OverlayPanel>(null)

    async function fetchTableData(page: number): Promise<void> {
        const res = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page + 1}`)
        const resData = await res.json()
        setRows(resData.data)
        setTotalRecords(parseInt(resData.pagination.total))
        setLoading(false)
    }

    async function submitHandler(totalRows: number): Promise<void> {
        const totalPagesToFetch = Math.ceil(totalRows / 12)
        let res, resData, data
        let tempArr: object[] = []
        const allRows: object[] = []
        if (selectedRows !== null) {
            tempArr = [...selectedRows]
        }
        for (let i = 0; i < totalPagesToFetch; i++) {
            res = await fetch(`https://api.artic.edu/api/v1/artworks?page=${i + 1}`)
            resData = await res.json()
            data = resData.data
            data.forEach((element: object): void => {
                if (allRows.length < totalRows) {
                    allRows.push(element)
                }
            })
        }

        for (let i = 0; i < allRows.length; i++) {
            if (tempArr.includes(allRows[i])) {
                break
            }
            tempArr.push(allRows[i])
        }
        setSelectedRows(tempArr)
        op.current?.hide()
    }

    const onSelectionChange = (e: { value: Row[] }) => {
        const currentPageRows = rows.map(row => row.id)
        let newSelectedRows: Row[] =[]
        if (selectedRows !== null) {
            newSelectedRows = [...selectedRows]
        }

        const filteredSelectedRows = newSelectedRows.filter(
            row => !currentPageRows.includes(row.id)
        )

        const updatedSelection = [...filteredSelectedRows, ...e.value]

        setSelectedRows(updatedSelection)
    }

    function inputHandler (e: React.ChangeEvent<HTMLInputElement>) {
        if (parseInt(e.target.value) <= 0) {
            setInput('1')
        } else {
            setInput(e.target.value)
        }
    }

    useEffect(() => {
        setLoading(true)
        fetchTableData(page)
    }, [page])


    const titleHeader = (
        <div className='title-header'>
            Title
            <button className='chevron-down' onClick={(e) => op.current?.toggle(e)}>
                <img src={down_icon} alt="chevron down icon" />
            </button>
            <OverlayPanel ref={op} >
                <div className='input-container'>
                    <input type='number' value={input} onChange={inputHandler} placeholder='Select rows...' />
                    <button onClick={() => submitHandler(parseInt(input))}>Submit</button>
                </div>
            </OverlayPanel>
        </div>
    )

    return (
        <>
            <DataTable 
            value={rows} 
            selectionMode="multiple" 
            selection={selectedRows!} 
            onSelectionChange={onSelectionChange} 
            dataKey="id" 
            scrollable 
            scrollHeight="flex"
            tableStyle={{ minWidth: '50rem' }}
            emptyMessage={loading ? <Skeleton /> : 'No data found'}>
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} body={<Skeleton />}></Column>
                <Column field="title" header={titleHeader} body={loading ? <Skeleton width="10rem" /> : undefined}></Column>
                <Column field="place_of_origin" header="Place Of Origin" body={loading ? <Skeleton /> : undefined}></Column>
                <Column field="artist_display" header="Artist Display" body={loading ? <Skeleton /> : undefined}></Column>
                <Column field="inscriptions" header="Inscriptions" body={loading ? <Skeleton /> : undefined}></Column>
                <Column field="date_start" header="Date Start" body={loading ? <Skeleton /> : undefined}></Column>
                <Column field="date_end" header="Date End" body={loading ? <Skeleton /> : undefined}></Column>
            </DataTable>
            <Pagination totalRecords={totalRecords} page={page} setPage={setPage} />
        </>
    )
}

export default Table
