"use client";

import React, { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { confirmDialog } from 'primereact/confirmdialog';

type TaskPekerjaan = {
    id: number;
    kode_sales: string;
    tanggal: string;
    kode_reseller: string;
    keterangan: string;
    status: number;
};

const TaskPekerjaanTable = () => {
    const [tasks, setTasks] = useState<TaskPekerjaan[]>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);

    useEffect(() => {
        const fetchData = async () => {
            const data: TaskPekerjaan[] = [
                {
                    id: 1,
                    kode_sales: 'SL000001',
                    tanggal: '2024-09-21',
                    kode_reseller: 'RS000002',
                    keterangan: 'KUNJUNGAN RESELLER',
                    status: 0
                }
            ];
            setTasks(data);
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
            <h5 className="m-0">Manage Task Pekerjaan</h5>
        </div>
    );

    const editTask = (task: TaskPekerjaan) => {
        toast.current?.show({ severity: 'info', summary: 'Edit', detail: `Edit task with ID ${task.id}` });
        // Tambahkan logika untuk mengedit data di sini
    };

    const deleteTask = (task: TaskPekerjaan) => {
        confirmDialog({
            message: `Are you sure you want to delete task with ID ${task.id}?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                setTasks(tasks.filter(t => t.id !== task.id));
                toast.current?.show({ severity: 'success', summary: 'Delete', detail: 'Task deleted' });
            }
        });
    };

    const actionBodyTemplate = (rowData: TaskPekerjaan) => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-success mr-2"
                    onClick={() => editTask(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-danger"
                    onClick={() => deleteTask(rowData)}
                />
            </React.Fragment>
        );
    };

    return (
        <div className="datatable-crud-demo">
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate} />
                <DataTable
                    value={tasks}
                    paginator
                    rows={10}
                    header={header}
                    globalFilter={globalFilter}
                    emptyMessage="No tasks found."
                >
                    <Column field="id" header="ID" sortable />
                    <Column field="kode_sales" header="Kode Sales" sortable />
                    <Column field="tanggal" header="Tanggal" sortable />
                    <Column field="kode_reseller" header="Kode Reseller" sortable />
                    <Column field="keterangan" header="Keterangan" sortable />
                    <Column field="status" header="Status" sortable />
                    <Column body={actionBodyTemplate} header="Aksi" />
                </DataTable>
            </div>
        </div>
    );
};

export default TaskPekerjaanTable;
