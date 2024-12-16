import { m } from 'framer-motion';
import MenuItem from '@mui/material/MenuItem';
import React, { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import { Box, Typography } from '@mui/material';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { varHover } from 'src/components/animate';
import Iconify from 'src/components/iconify';
import { PermissionConstants } from 'src/@core/constants/permission';
import { COOKIE_NAME } from 'src/@core/constants/common';
import cookie from 'react-cookies'
import  MiniAppService  from 'src/@core/service/miniApp';


const miniApps = [
    {
        label: 'Dashboard',
        icon: '/assets/images/DashBoard.png',
        path: 'https://hcmue.fm.edu.vn',
        permissions: [PermissionConstants.AccessDashboard]
    },
    {
        label: 'Lending Device',
        icon: '/assets/images/LD.png',
        path: 'https://ld-hcmue.fm.edu.vn',
        permissions: [PermissionConstants.AccessLD]
    },
    {
        label: 'Quality Control Report',
        icon: '/assets/images/QCR.png',
        path: 'https://qcr-hcmue.fm.edu.vn',
        permissions: [PermissionConstants.AccessQCR]
    },
]

export default function MiniAppsPopover() {
    const popover = usePopover();
    const [miniApps,setMiniApps] = useState<any>();
    const userPermissions = cookie.load(COOKIE_NAME.PERMISSIONS);
    const [itemCount,setItemCount] = useState<number>(0);

    const loadData = async()=>{
        const response:any = await MiniAppService.getAll();
        let count=0;
        response.map((app:any)=>{
            const check = userPermissions.some((p:any)=>app.permission.includes(p.permission));
            check? count+=1:count=count;
        })
        setMiniApps(response);
        setItemCount(count);
    }


    useEffect(()=>{
        loadData();
    },[])
    return (
        <>
            <IconButton
                component={m.button}
                whileTap="tap"
                whileHover="hover"
                variants={varHover(1.05)}
                onClick={popover.onOpen}
                sx={{
                    width: 40,
                    height: 40,
                    ...(popover.open && {
                        bgcolor: 'action.selected',
                    }),
                }}
            >
                <Iconify icon="mdi:apps" sx={{ borderRadius: 0.65, width: 32 }} />
            </IconButton>
            <CustomPopover open={popover.open} onClose={popover.onClose}>
            <Box
                    display="grid"
                    gridTemplateColumns={`repeat(${itemCount>3?3:itemCount}, 1fr)`}
                    gap={0.5}
                >
                    {miniApps && miniApps.map((app:any,index:any) => {
                        if (!userPermissions.some((p: any) =>
                            app.permission.includes(p.permission))) {
                            return null;
                        }
                        else {
                            return (<MenuItem
                                key={index}
                                onClick={() => window.open(app.path, '_blank')}
                                sx={{
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: 'auto',
                                    borderRadius: 1,
                                    '&:hover': {
                                        backgroundColor: 'action.hover',
                                    },
                                }}
                            >
                                <Box component="img" src={`/assets/images/${app.logo}`} sx={{ width: 80, height: 80 }} />
                                <Typography sx={{ fontWeight: 'medium', fontSize: 12 }}>
                                    {app.appName}
                                </Typography>
                            </MenuItem>)
                        }
                    })}
                </Box>
            </CustomPopover>
        </>
    )
}