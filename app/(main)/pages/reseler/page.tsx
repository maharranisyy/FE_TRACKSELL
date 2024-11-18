/* eslint-disable @next/next/no-img-element */
'use client';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

// Google Maps imports
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

// Definisikan interface untuk SalesUser
interface SalesUser {
    id?: string;
    name: string;
    email: string;
    address: string;
    phone_number: string;
    latitude: number;
    longitude: number;
}

const Reseller = () => {
    const emptyProduct: SalesUser = {
        id: '',
        name: '',
        email: '',
        address: '',
        phone_number: '',
        latitude: 0,
        longitude: 0,
    };

    const [products, setProducts] = useState<SalesUser[]>([]);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProduct, setDeleteProduct] = useState<SalesUser | null>(null);
    const [product, setProduct] = useState<SalesUser>(emptyProduct);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [mapVisible, setMapVisible] = useState(false);
    const [selectedReseller, setSelectedReseller] = useState<SalesUser | null>(null);
    const toast = useRef<Toast>(null);

    // Load Google Maps API
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    });

    // Fetch data dari Laravel API
    const fetchProducts = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.get('http://localhost:8000/api/users-reseller', {
                headers: {
                    Authorization: `Bearer ${token}`, // Sertakan token di sini
                },
            });
            const data = response.data.map((user: any) => ({
                ...user,
                latitude: Number(user.latitude),
                longitude: Number(user.longitude),
            }));
            setProducts(data);
        } catch (error) {
            console.error('Error fetching sales users:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to fetch users',
                life: 3000,
            });
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const editProduct = (product: SalesUser) => {
        setProduct({ ...product });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product: SalesUser) => {
        setDeleteProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProductById = async () => {
        const token = localStorage.getItem('authToken');
        if (deleteProduct) {
            try {
                await axios.delete(`http://localhost:8000/api/users-reseller/${deleteProduct.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Sertakan token di sini
                    },
                });
                setProducts(products.filter(val => val.id !== deleteProduct.id));
                setDeleteProductDialog(false);
                setDeleteProduct(null);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Deleted',
                    life: 3000,
                });
            } catch (error) {
                console.error('Error deleting product:', error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to delete product',
                    life: 3000,
                });
            }
        }
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const saveProduct = async () => {
        const token = localStorage.getItem('authToken');
        setSubmitted(true);

        if (
            product.name.trim() &&
            product.email.trim() &&
            product.address.trim() &&
            product.phone_number.trim() &&
            !isNaN(product.latitude) &&
            !isNaN(product.longitude) &&
            product.latitude >= -90 && product.latitude <= 90 &&
            product.longitude >= -180 && product.longitude <= 180
        ) {
            try {
                let _products = [...products];
                let _product = { ...product };

                if (product.id) {
                    // Update existing product
                    await axios.put(`http://localhost:8000/api/users-reseller/${product.id}`, _product, {
                        headers: {
                            Authorization: `Bearer ${token}`, // Sertakan token di sini
                        },
                    });
                    const index = _products.findIndex(p => p.id === product.id);
                    _products[index] = _product;
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Product Updated',
                        life: 3000,
                    });
                } else {
                    // Create new product
                    const response = await axios.post('http://localhost:8000/api/users-reseller', _product, {
                        headers: {
                            Authorization: `Bearer ${token}`, // Sertakan token di sini
                        },
                    });
                    _products.push(response.data);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Product Created',
                        life: 3000,
                    });
                }

                setProducts(_products);
                setProductDialog(false);
                setProduct(emptyProduct);
            } catch (error) {
                console.error('Error saving product:', error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to save product',
                    life: 3000,
                });
            }
        }
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        const val = name === 'latitude' || name === 'longitude' ? parseFloat(e.target.value) : e.target.value;
        setProduct({ ...product, [name]: val });
    };

    const openMap = (reseller: SalesUser) => {
        const isValidLatitude = typeof reseller.latitude === 'number' && reseller.latitude >= -90 && reseller.latitude <= 90;
        const isValidLongitude = typeof reseller.longitude === 'number' && reseller.longitude >= -180 && reseller.longitude <= 180;

        if (isValidLatitude && isValidLongitude) {
            setSelectedReseller(reseller);  // Menyimpan reseller yang dipilih ke state
            setMapVisible(true);            // Menampilkan dialog peta
        } else {
            toast.current?.show({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Invalid location data for this reseller.',
                life: 3000,
            });
        }
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Reseller Users</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e: React.ChangeEvent<HTMLInputElement>) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveProduct} />
        </>
    );

    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" onClick={deleteProductById} />
        </>
    );

    const actionBodyTemplate = (rowData: SalesUser) => {
        return (
            <div className="flex gap-2">
                <Button icon="pi pi-pencil" className="p-button-warning p-button-rounded p-button-text" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" className="p-button-danger p-button-rounded p-button-text" onClick={() => confirmDeleteProduct(rowData)} />
                <Button label="View Location" className="p-button-info p-button-rounded p-button-text" onClick={() => openMap(rowData)} />
            </div>
        );
    };

    // Konfigurasi style container Google Map
    const mapContainerStyle = {
        width: '100%',
        height: '500px', // Menambah tinggi peta menjadi 500px
    };

    // Konfigurasi style dialog untuk peta
    const mapDialogStyle = {
        width: '90vw', // Menambah lebar peta menjadi 90% dari view width
        maxWidth: '1200px', // Memberi batas lebar maksimal
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={<Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />} />

                    <DataTable
                        value={products}
                        paginator
                        rows={10}
                        dataKey="id"
                        rowsPerPageOptions={[5, 10, 25]}
                        globalFilter={globalFilter}
                        emptyMessage="No users found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column field="name" header="Name" sortable style={{ minWidth: '16rem' }} />
                        <Column field="email" header="Email" sortable style={{ minWidth: '12rem' }} />
                        <Column field="address" header="Address" sortable style={{ minWidth: '12rem' }} />
                        <Column field="phone_number" header="Phone Number" sortable style={{ minWidth: '10rem' }} />
                        <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }} />
                    </DataTable>

                    {/* Dialog peta */}
                    <Dialog visible={mapVisible} style={mapDialogStyle} header="Map" modal onHide={() => setMapVisible(false)}>
                        {isLoaded && selectedReseller && (
                            <>
                                <GoogleMap
                                    mapContainerStyle={mapContainerStyle}
                                    center={{ lat: selectedReseller.latitude, lng: selectedReseller.longitude }}
                                    zoom={15}
                                >
                                    <Marker position={{ lat: selectedReseller.latitude, lng: selectedReseller.longitude }} />
                                </GoogleMap>
                                {/* Tambahkan button Close di bawah peta */}
                                <div className="flex justify-content-center mt-3">
                                    <Button label="Close" className="p-button-text p-button-danger" onClick={() => setMapVisible(false)} />
                                </div>
                            </>
                        )}
                    </Dialog>

                    {/* Dialog untuk create/update */}
                    <Dialog visible={productDialog} style={{ width: '450px' }} header="User Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText id="name" value={product.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
                            {submitted && !product.name && <small className="p-error">Name is required.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <InputText id="email" value={product.email} onChange={(e) => onInputChange(e, 'email')} required className={classNames({ 'p-invalid': submitted && !product.email })} />
                            {submitted && !product.email && <small className="p-error">Email is required.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="address">Address</label>
                            <InputText id="address" value={product.address} onChange={(e) => onInputChange(e, 'address')} required className={classNames({ 'p-invalid': submitted && !product.address })} />
                            {submitted && !product.address && <small className="p-error">Address is required.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="phone_number">Phone Number</label>
                            <InputText id="phone_number" value={product.phone_number} onChange={(e) => onInputChange(e, 'phone_number')} required className={classNames({ 'p-invalid': submitted && !product.phone_number })} />
                            {submitted && !product.phone_number && <small className="p-error">Phone Number is required.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="latitude">Latitude</label>
                            <InputText id="latitude" value={product.latitude.toString()} onChange={(e) => onInputChange(e, 'latitude')} required />
                            {submitted && isNaN(product.latitude) && <small className="p-error">Latitude is required.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="longitude">Longitude</label>
                            <InputText id="longitude" value={product.longitude.toString()} onChange={(e) => onInputChange(e, 'longitude')} required />
                            {submitted && isNaN(product.longitude) && <small className="p-error">Longitude is required.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="confirmation-content flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {deleteProduct && (
                                <span>
                                    Are you sure you want to delete <b>{deleteProduct.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Reseller;
