import { Breadcrumbs, Link, Typography } from '@mui/material'
import React from 'react'

type items = {
    title: string;
    link: string;
}
interface props {
    items: items[]
}
const BreadCrumbsComponent = ({ items }: props) => {
    return (
        <Breadcrumbs aria-label="breadcrumb" separator="/">
            {items.length>1 && items.map((item: items, index: number) => {
                if (index !== items.length - 1) {
                    return (
                        <Link underline="hover" key={item.title} href={item.link}>
                            {item.title}
                        </Link>
                    );
                } else {
                    return (
                        <Typography key={item.title} variant="subtitle1">
                            {item.title}
                        </Typography>
                    );
                }
            })}
        </Breadcrumbs>
    )
}

export default BreadCrumbsComponent