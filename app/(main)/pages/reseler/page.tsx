/* eslint-disable @next/next/no-img-element */
'use client';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

// Google Maps API
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

// Interface untuk Reseller
interface Reseller {
    id?: string;
    kode_reseller: string;
    name: string;
    email: string;
    birthdate: string;
    gender: string;
    phone: string;
    address: string;
    latitude: number | null;
    longitude: number | null;
    status: string;
    user_sales_id: string;
}

const Reseller = () => {
    const emptyReseller: Reseller = {
        id: '',
        kode_reseller: '',
        name: '',
        email: '',
        birthdate: '',
        gender: '',
        phone: '',
        address: '',
        latitude: null,
        longitude: null,
        status: 'unverified',
        user_sales_id: '',
    };

    const [resellers, setResellers] = useState<Reseller[]>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [mapVisible, setMapVisible] = useState(false);
    const [selectedReseller, setSelectedReseller] = useState<Reseller | null>(null);
    const toast = useRef<Toast>(null);

    // Load Google Maps API
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '', // Masukkan API key di .env
    });

    // Fetch data dari Laravel API
    const fetchResellers = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.get('http://localhost:8000/api/resellers', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setResellers(response.data);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to fetch resellers',
                life: 3000,
            });
        }
    };

    useEffect(() => {
        fetchResellers();
    }, []);

    const openMap = (reseller: Reseller) => {
        setSelectedReseller(reseller);
        setMapVisible(true);
    };

    const geolocationBodyTemplate = (rowData: Reseller) => (
        <Button
            label="Geolocation"
            icon="pi pi-map"
            className="p-button-rounded p-button-info"
            onClick={() => openMap(rowData)}
            disabled={!rowData.latitude || !rowData.longitude} // Disable jika latitude atau longitude null
        />
    );

    const header = (
        <div className="flex justify-content-between">
            <h5 className="m-0">Manage Resellers</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                    type="search"
                    onInput={(e: React.ChangeEvent<HTMLInputElement>) => setGlobalFilter(e.target.value)}
                    placeholder="Search..."
                />
            </span>
        </div>
    );

    return (
        <div className="crud-demo">
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={<Button label="New" icon="pi pi-plus" />} />
                <DataTable
                    value={resellers}
                    paginator
                    rows={10}
                    header={header}
                    globalFilter={globalFilter}
                    responsiveLayout="scroll"
                    emptyMessage="No resellers found."
                >
                    <Column field="name" header="Name" sortable />
                    <Column field="email" header="Email" sortable />
                    <Column field="birthdate" header="Birthdate" sortable />
                    <Column field="gender" header="Gender" sortable />
                    <Column field="phone" header="Phone" sortable />
                    <Column field="address" header="Address" sortable />
                    <Column field="latitude" header="Latitude" sortable />
                    <Column field="longitude" header="Longitude" sortable />
                    <Column body={geolocationBodyTemplate} header="Geolocation" />
                </DataTable>
            </div>

            {/* Dialog untuk menampilkan peta */}
            <Dialog
                visible={mapVisible}
                style={{ width: '50vw' }}
                header="Geolocation"
                modal
                onHide={() => setMapVisible(false)}
            >
                {isLoaded && selectedReseller?.latitude && selectedReseller?.longitude ? (
                    <GoogleMap
                        mapContainerStyle={{ height: '400px', width: '100%' }}
                        center={{
                            lat: selectedReseller.latitude,
                            lng: selectedReseller.longitude,
                        }}
                        zoom={15}
                    >
                        <Marker
                            position={{
                                lat: selectedReseller.latitude,
                                lng: selectedReseller.longitude,
                            }}
                        />
                    </GoogleMap>
                ) : (
                    <p>Loading Map...</p>
                )}
            </Dialog>
        </div>
    );
};

export default Reseller;
