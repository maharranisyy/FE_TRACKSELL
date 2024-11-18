"use client";

import React, { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';

type LaporanPekerjaan = {
    id: number;
    nama_sales: string;
    jam_ditugaskan: string;
    jam_selesai: string;
    jam_pekerjaan: string;
    waktu_tanggal_pekerjaan: string;
    status: 'Selesai' | 'Diproses';
    keterangan: string;
};

const LaporanPekerjaanTable = () => {
    const [laporan, setLaporan] = useState<LaporanPekerjaan[]>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [selectedTask, setSelectedTask] = useState<LaporanPekerjaan | null>(null);
    const [showDetailDialog, setShowDetailDialog] = useState(false);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        const fetchData = async () => {
            const data: LaporanPekerjaan[] = [
                {
                    id: 1,
                    nama_sales: 'John Doe',
                    jam_ditugaskan: '08:00',
                    jam_selesai: '10:00',
                    jam_pekerjaan: '08:30',
                    waktu_tanggal_pekerjaan: '2024-09-21 08:30',
                    status: 'Diproses',
                    keterangan: 'Kunjungan ke reseller'
                },
                {
                    id: 2,
                    nama_sales: 'Jane Smith',
                    jam_ditugaskan: '09:00',
                    jam_selesai: '11:30',
                    jam_pekerjaan: '09:00',
                    waktu_tanggal_pekerjaan: '2024-09-21 09:00',
                    status: 'Selesai',
                    keterangan: 'Pengiriman barang'
                }
            ];
            setLaporan(data);
        };
        fetchData();
    }, []);

    const leftToolbarTemplate = () => {
        return <Button label="New" icon="pi pi-plus" />;
    };

    const rightToolbarTemplate = () => {
        return (
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                    type="search"
                    onInput={(e: React.ChangeEvent<HTMLInputElement>) => setGlobalFilter(e.target.value)}
                    placeholder="Search..."
                />
            </span>
        );
    };

    const header = (
        <div className="table-header">
            <h5 className="m-0">Manage Laporan Pekerjaan</h5>
        </div>
    );

    const statusBodyTemplate = (rowData: LaporanPekerjaan) => {
        const buttonClassName = rowData.status === 'Selesai' ? 'p-button-success' : 'p-button-warning';
        return (
            <Button
                label={rowData.status}
                className={`p-button ${buttonClassName} p-button-rounded`}
            />
        );
    };

    const actionBodyTemplate = (rowData: LaporanPekerjaan) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => onEdit(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => onDelete(rowData)} />
            </React.Fragment>
        );
    };

    const nameBodyTemplate = (rowData: LaporanPekerjaan) => {
        return (
            <Button
                label={rowData.nama_sales}
                className="p-button-link"
                onClick={() => onNameClick(rowData)}
            />
        );
    };

    const onEdit = (task: LaporanPekerjaan) => {
        toast.current?.show({ severity: 'info', summary: 'Edit', detail: `Edit ${task.nama_sales}` });
    };

    const onDelete = (task: LaporanPekerjaan) => {
        toast.current?.show({ severity: 'warn', summary: 'Delete', detail: `Delete ${task.nama_sales}` });
    };

    const onNameClick = (task: LaporanPekerjaan) => {
        setSelectedTask(task);
        setShowDetailDialog(true);
    };

    const hideDetailDialog = () => {
        setShowDetailDialog(false);
        setSelectedTask(null);
    };

    const detailDialogFooter = (
        <Button label="Close" icon="pi pi-times" onClick={hideDetailDialog} />
    );

    return (
        <div className="datatable-crud-demo">
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate} />
                <DataTable
                    value={laporan}
                    paginator
                    rows={10}
                    header={header}
                    globalFilter={globalFilter}
                    emptyMessage="No laporan found."
                >
                    <Column field="nama_sales" header="Nama Sales" body={nameBodyTemplate} sortable />
                    <Column field="jam_ditugaskan" header="Jam Ditugaskan" sortable />
                    <Column field="jam_selesai" header="Jam Selesai" sortable />
                    <Column field="jam_pekerjaan" header="Jam Pekerjaan" sortable />
                    <Column field="waktu_tanggal_pekerjaan" header="Waktu Tanggal Pekerjaan" sortable />
                    <Column field="status" header="Status" body={statusBodyTemplate} sortable />
                    <Column header="Aksi" body={actionBodyTemplate} />
                </DataTable>
            </div>

            <Dialog
                header="Detail Pekerjaan"
                visible={showDetailDialog}
                style={{ width: '30vw', minHeight: '50vh' }} // Mengatur lebar dan tinggi dialog
                footer={detailDialogFooter}
                onHide={hideDetailDialog}
            >
                {selectedTask && (
                    <div>
                        <p><strong>Nama Sales:</strong> {selectedTask.nama_sales}</p>
                        <p><strong>Jam Ditugaskan:</strong> {selectedTask.jam_ditugaskan}</p>
                        <p><strong>Jam Selesai:</strong> {selectedTask.jam_selesai}</p>
                        <p><strong>Jam Pekerjaan:</strong> {selectedTask.jam_pekerjaan}</p>
                        <p><strong>Waktu Tanggal Pekerjaan:</strong> {selectedTask.waktu_tanggal_pekerjaan}</p>
                        <p><strong>Status:</strong> {selectedTask.status}</p>
                        <p><strong>Keterangan:</strong> {selectedTask.keterangan}</p>
                    </div>
                )}
            </Dialog>
        </div>
    );
};

export default LaporanPekerjaanTable;
