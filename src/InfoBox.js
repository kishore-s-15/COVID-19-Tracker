import React from 'react';
import "./InfoBox.css";
import { Card, CardContent, Typography } from '@material-ui/core';

function InfoBox({ active, title, cases, total, isRed, onClick }) {
    return (
        <Card onClick={onClick} className={`infoBox ${active && 'infoBox--selected'} ${isRed && 'infoBox--red'}`}>
            <CardContent>
                {/* Title */}
                <Typography className="infoBox__title" color="textSecondary">
                    { title }
                </Typography>

                {/* Number of cases */}
                <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>{ cases }</h2>

                {/* Total cases */}
                <Typography className="infoBox__total" color="textSecondary">
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
