/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '@/types';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model: AppMenuItem[] = [
        {
            label: '',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: '',
            items: [
                {
                    label: 'Data',
                    icon: 'pi pi-fw pi-id-card',
                    items: [
                        { label: 'Sales', icon: 'pi pi-fw pi-user', to: '/pages/sales' },
                        { label: 'Reseller', icon: 'pi pi-fw pi-briefcase', to: '/pages/reseler' }
                    ]
                },
                
                { label: 'Pekerjaan', icon: 'pi pi-fw pi-bookmark', to: '/pages/pekerjaan' }, 
            ]
        },

        {
            label: '',
            icon: 'pi pi-fw pi-briefcase',
            to: '/pages',
            items: [
                
            ]
        },
        {
            label: '',
            icon: 'pi pi-fw pi-briefcase',
            to: '/pages',
            items: [
                {
                    label: 'Laporan',
                    icon: 'pi pi-fw pi-circle-off',
                    to: '/pages/laporan'
                }
            ]
        },
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;})}
                <Link href="https://blocks.primereact.org" target="_blank" style={{ cursor: 'pointer' }}>
                </Link>
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
