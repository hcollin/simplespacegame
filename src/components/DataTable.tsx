import { createStyles, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Theme } from "@material-ui/core"
import React, { FC } from "react"



const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        color: "#FFFD",
        borderColor: "red",
    },
    tableHead: {
        background: "#DDD4",
        
        border: "none",

        "& th": {
            borderBottom: "solid 2px #0008",
            borderTop: "solid 1px #FFF8",
            fontSize: "1rem",
            fontWeight: "bold",
            padding: "0.25rem 1rem",
        }
    },
    tableBody: {
        border: "none",
        "& tr":{
            background: "#3333",
            borderBottom: "solid 1px #0004",
            "&:nth-child(odd)": {
                background: "#5553",
            }
        },
        "& td": {
            borderBottom: "none",
            fontSize: "1rem",
            color: "#FFFD",
        }
    }
}));


export interface ColumnProps {
    key: string;
    header: string;
    size: number | string;
}

interface ObjectType {
    id: string | number;
    [key: string]: any;
}

export interface DataTableProps {
    columns: ColumnProps[];
    rows: ObjectType[];
    className?: string;
}

const DataTable: FC<DataTableProps> = (props: DataTableProps) => {
    const classes = useStyles();
    return (
        <TableContainer aria-label="simple table">
            <Table  classes={{ root: classes.root}}>
                <TableHead classes={{root: classes.tableHead}}>
                    <TableRow>
                        {props.columns.map((c: ColumnProps) => {
                            return (
                                <TableCell key={c.key} width={c.size}>
                                    {c.header}
                                </TableCell>
                            )
                        })}
                    </TableRow>
                </TableHead>

                <TableBody classes={{root: classes.tableBody}}>
                    {props.rows.map((val: any) => {
                        return (
                            <TableRow key={val.id}>

                                {props.columns.map((c: ColumnProps) => {
                                    return (
                                        <TableCell key={`${val.id}-${c.key}`}>
                                            {val[c.key]}
                                        </TableCell>
                                    )

                                })}

                            </TableRow>
                        )

                    })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default DataTable;