import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator'
import { useState } from 'react'

interface props {
    totalRecords: number,
    setPage(arg: number): void,
    page: number;
}

function Pagination({ totalRecords, setPage, page }: props) {
    const [first, setFirst] = useState<number>(0)
    const [rowsPerPage, setRowsPerPage] = useState(12)
    
    const onPageChange = (event: PaginatorPageChangeEvent) => {
        setFirst(event.first);
        setRowsPerPage(event.rows)
        setPage(event.page)
    };
    console.log(first)
    
    return (
        <div className="card">
            <Paginator first={page * rowsPerPage} rows={rowsPerPage} totalRecords={totalRecords} onPageChange={onPageChange} />
        </div>
    )
}

export default Pagination
