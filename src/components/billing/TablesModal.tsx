import React, {useState} from 'react';
import {MODALS} from "./BillingFooterContent";
import {toast} from "react-toastify";
import {digits} from "../../constants/constant";
import _ from "lodash";

interface ITableListModalPropsType{
    selectTable: Function;
    setModalState: Function;
    tablesData: [];
}

let timer = 0, number = 0;
const TableListModal = (props:ITableListModalPropsType) => {
    const [selectedTable, setSelectedTable] = useState<any>({});
    const [personsCount, setPersonsCount] = useState(0);
    const [recentDigits, setRecentDigits] = useState([]);
    const getTableContent = () => (
        props.tablesData?.filter((table: any) => !table.isSelected).map((table: any) => (
            <div className={`table ${selectedTable?.id === table.id ? 'selected' : ''}`}
                 onClick={() => setSelectedTable(table)}
            >
                <span>{table.name}</span>
                <span className='description'>{table.description}</span>
                <span className='capacity'>Capacity: <b>{table.noOfPerson}</b></span>
            </div>
        ))
    )

    const handleSelect = () => {
        if (!_.isEmpty(selectedTable) && personsCount ) { // Check if its just a empty object
            props.selectTable({...selectedTable, personsCount});
            props.setModalState(MODALS.NONE);
        } else {
            toast.error('Select a table please!');
        }
    }

    const updateQty = (e: any) => {
        const num = Number(e.target.id);

        // Update the value of number
        number = (number * 10) + num;

        // Only process if some no-zero qty is added
        if (number) {
            setRecentDigits(prevState => {
                return [...prevState.slice(2), num];
            })
            if (timer) {
                clearTimeout(timer); // clear the previous execution and start new one
            }

            // @ts-ignore
            timer = setTimeout(() => {
                // Only select if persons count is <= noOfPerson, and reset the values in both the cases
                if (number > selectedTable.noOfPerson) {
                    toast.error(`Selected table has capacity of only ${selectedTable.noOfPerson} person!`)
                } else {
                    setPersonsCount(number); // should be replacing and not adding
                }
                // reset timer value
                timer = 0;
                number = 0;
                setRecentDigits([]);
            }, 700);
        }
    }

    return(
        <div className="select-table-container">
            <div className="select-table-container-header">
                <h2>Select Table</h2>
            </div>
            <div className="select-table-container-content">
                { !props.tablesData?.filter((table: any) => !table.isSelected).length ? (
                    <div className='no-results'>No tables to select from!</div>
                ) : (
                    <>
                        <div className="tables">
                            { getTableContent() }
                        </div>
                        {
                            !_.isEmpty(selectedTable) ? (
                                <div className='persons-container'>
                                    <div className='label'>No Of Persons: <i>{personsCount}</i></div>
                                    <div className="number-list">
                                        {
                                            digits.map(digit =>
                                                <span
                                                    className={`${(selectedTable.noOfPerson < digit || (!digit && selectedTable.noOfPerson < 10)) && 'disabled-digit'} ${recentDigits.includes(digit) && 'recent-digit'}`}
                                                    onClick={updateQty}
                                                    id={`${digit}`}
                                                >{digit}</span>
                                            )
                                        }
                                    </div>
                                </div>
                            ) : 0
                        }
                        <div className='button-container'>
                            <div
                                className='button cancel'
                                onClick={() => props.setModalState(MODALS.NONE)}
                            >
                                Cancel
                            </div>
                            <div
                                className='button ok'
                                onClick={handleSelect}
                            >
                                OK
                            </div>
                        </div>
                    </>
                    )}
            </div>
        </div>
    )
};

export default TableListModal;
