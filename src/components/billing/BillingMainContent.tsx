import React, {useEffect, useState} from "react";
import '../../assets/scss/pages/billing.scss';
import MenuItemsBackendApiService from "../../services/menu-items-backend-api.service";
import {toast} from "react-toastify";
import Overlay from "../../assets/scss/components/Overlay";
import ViewKitchenInfo from "./ViewKitchenInfo";
import POSBackendApiService from "../../services/pos-backend-api.service";
import BillingFooterContent from "./BillingFooterContent";
import {CheckCircleTwoTone} from "@ant-design/icons";
import {message} from "antd";
import _ from "lodash";
import SelectVariantComponent from "./SelectVariantComponent";
import {getNumber} from "../../services/generic.service";
import {digits} from "../../constants/constant";

// interface IItem {
//     id: string,
//     name: string,
//     sellingPrice: number,
//     qty: number
// }

export enum BillingDataKeys {
    BILL_ITEMS = "BILL_ITEMS",
    BILL_ORDERS = "BILL_ORDERS",
    BILL_SELECTED_ITEMS_MAP = "BILL_SELECTED_ITEMS_MAP",
    BILLING_PRICE_MAP = "BILLING_PRICE_MAP",
    BILL_TABLES_LIST = "BILL_TABLES_LIST",
}

enum BillingDataOperation {
    GET_DATA = "GET_DATA",
    SET_DATA = "SET_DATA",
}

let timer = 0;
let number = 0;

const BillingMainContent = () => {
    const [menuCategories, setMenuCategories] = useState([]);
    const [tablesList, setTablesList] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [favoriteMenuItems, setFavoriteMenuItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<any>({});
    const [orderList, setOrderList] = useState<any>([]);
    const [billItems, setBillItems] = useState<any>({}); // Mapping of tableId to list of bill items
    const [selectedItemMap, setSelectedItemMap] = useState<any>({});
    const [totalBillingPrice, setTotalBillingPrice] = useState<{ [key: string]: number }>({}); // Mapping of tableId to their total bill price
    const [showKitchenInfoModal, setShowKitchenInfoModal] = useState(false);
    const [showMenuItemVariantsModal, setShowMenuItemVariantsModal] = useState(false);
    const [selectedMenuItemToAdd, setSelectedMenuItemToAdd] = useState();
    const [recentDigits, setRecentDigits] = useState([]);

    const [methodOfPayment, setMethodOfPayment] = useState('CASH'); // Update this is to enum
    const [isBillingLoading, setIsBillingLoading] = useState(false);
    const [isBillingSuccess, setIsBillingSuccess] = useState(false);
    const [isDeleteBillLoading, setIsDeleteBillLoading] = useState(false);
    const [isDeleteBillSuccess, setIsDeleteBillSuccess] = useState(false);

    useEffect(() => {
        // Fetch all categories
        initiateValues().then(_ => {
            getPreviouslySavedBillingData();
        });
    }, [])

    // TODO can be moved to a dedicated util file
    const getPreviouslySavedBillingData = () => {
        Object.keys(BillingDataKeys).map((billingKey) => {
            updatedBillingData(billingKey as BillingDataKeys, null, BillingDataOperation.GET_DATA);
        });
    }

    const updatedBillingData = (key: BillingDataKeys, updatedData: any, operation: BillingDataOperation = BillingDataOperation.SET_DATA) => {
        if (operation === BillingDataOperation.SET_DATA) {
            localStorage.setItem(key, JSON.stringify(updatedData));
        } else {
            try {
                updatedData = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)): null;
            } catch (e) {
                toast.error('Something went wrong while retrieving saved billing data')
            }

            if (!updatedData) {
                return;
            }
        }

        switch (key) {
            case BillingDataKeys.BILL_ITEMS: {
                setBillItems(updatedData);
                break;
            }
            case BillingDataKeys.BILLING_PRICE_MAP: {
                setTotalBillingPrice(updatedData);
                break;
            }
            case BillingDataKeys.BILL_ORDERS: {
                setOrderList(updatedData);
                break;
            }
            case BillingDataKeys.BILL_SELECTED_ITEMS_MAP: {
                setSelectedItemMap(updatedData);
                break;
            }
            case BillingDataKeys.BILL_TABLES_LIST: {
                setTablesList(updatedData);
                break;
            }
        }
    }

    const initiateValues = async () => {
        const { data: menuCategoryRes} = await MenuItemsBackendApiService.fetchAllMenuCategories();
        const {data: tablesRes} = await POSBackendApiService.fetchAllTables();
        const favMenuItemsRes = await MenuItemsBackendApiService.fetchAllFavouriteMenuItems();

        if (menuCategoryRes?.length) {
            setMenuCategories(menuCategoryRes);
            getMenuItems(menuCategoryRes[0]);
        }

        if (tablesRes && tablesRes.length) {
            updatedBillingData( BillingDataKeys.BILL_TABLES_LIST, tablesRes.map((tableItem: any) => {
                return {
                    id: tableItem.id,
                    description: tableItem.description,
                    name: tableItem.name,
                    noOfPerson: tableItem.noOfPerson
                }
            }));
        }
        if (favMenuItemsRes && favMenuItemsRes.length) {
            setFavoriteMenuItems(favMenuItemsRes.slice(0, 4));
        }
    }

    const addActiveTable = (selectedTable: any) => {
        // Only proceed for tables which are not selected
        if (!selectedTable.isSelected) {
            let order: any = {};
            const updatedTable = tablesList.map((table) => {
                if (table.id === selectedTable.id) {
                    order = {
                        id: table.id,
                        name: table.name,
                        type: 'DINE_IN',
                        personsCount: selectedTable.personsCount,
                    }
                    return {
                        ...table,
                        isSelected: true,
                    }
                }
                return table;
            });
            updatedBillingData(BillingDataKeys.BILL_ORDERS, [ ...orderList, order ])
            updatedBillingData(BillingDataKeys.BILL_TABLES_LIST, updatedTable)
            toast.success(`Table '${selectedTable.name}' with ${selectedTable.personsCount} persons added successfully!`);
        }
    }

    const addTakeAway = (takeAwayName: any) => {
        const id = new Date().getTime();
        updatedBillingData(BillingDataKeys.BILL_ORDERS, [...orderList, {
            id,
            name: `${takeAwayName}-${id}`,
            type: 'TAKE_AWAY',
        }]);
        toast.success(`Added a Take Away order for ${takeAwayName}`);
    }

    const addOnlineOrder = (platformName: any) => {
        const id = new Date().getTime();
        updatedBillingData(BillingDataKeys.BILL_ORDERS, [...orderList, {
            id,
            name: `${platformName}-${id}`,
            type: 'ONLINE_ORDER',
        }])
        toast.success(`Added an Online order for ${platformName}`);
    }

    const attachCustomerToOrder = (data: any) => {
        setSelectedOrder((prevOrder: any) => ({
            ...prevOrder,
            customerId: data.id
        }));
        // As the selecteditemMap can be updated if we switch to some other order, so just to make it persistent
        //  we need to add sentTokitchen status to ordersList as well
        const updatedOrderList = orderList.map((order: any) => {
            return {
                ...order,
                customerId: order.id === selectedOrder.id ? data.id : order.customerId,
            }
        });
        updatedBillingData(BillingDataKeys.BILL_ORDERS, updatedOrderList)
        toast.success('Customer added to the active order');
    }

    const checkIfVariantPresent = (item: any) => {
        if (item.variants?.length) {
            setShowMenuItemVariantsModal(true);
            setSelectedMenuItemToAdd(item);
        } else {
            handleMenuItemClickEvent({
                id: item.id,
                name: item.name,
                arabicName: item.arabicName,
                sellingPrice: item.sellingPrice,
                materials: item.materials,
            });
        }
    }

    const handleVariantClick = (item: any) => {
        setShowMenuItemVariantsModal(false);
        handleMenuItemClickEvent(item);
    }

    const handleMenuItemClickEvent = (item: any) => {
        let idWithIndex = '';
        if (selectedOrder?.id && !selectedOrder?.isFreezed) { // Proceed only if we have a table selected
            let updatedBillItems = {...billItems};
            // If there is no item at all for the selected Order, then assign an array with this item as the first billing item
            if (!updatedBillItems[selectedOrder.id]) {
                idWithIndex = `${item.id}____0`
                updatedBillItems[selectedOrder.id] = [
                    {
                        ...item,
                        idWithIndex,
                        qty: 1,
                        kitchenInfo: '',
                        sentToKitchen: false
                    }];
            } else {
                const itemPresentInBill = updatedBillItems[selectedOrder.id].filter((billItem: any) => billItem.id === item.id);
                // There is no instance of this item present for the selected Order
                if (!itemPresentInBill.length) {
                    idWithIndex = `${item.id}____0`
                    updatedBillItems[selectedOrder.id].push({
                        ...item,
                        idWithIndex,
                        qty: 1,
                        kitchenInfo: '',
                        sentToKitchen: false,
                    });
                } else {
                    // Loop over all of "this item"s active instances in the bill present right now
                    let allSentToKitchen = true;
                    let itemNotSentToKitchenIdx = -1;
                    itemPresentInBill.every((itemInstance: any, idx: number) => {
                        if (!itemInstance.sentToKitchen) {
                            allSentToKitchen = false;
                            itemNotSentToKitchenIdx = idx;
                            return false;
                        }
                        return true;
                    })
                    const matchedItem = itemPresentInBill[itemNotSentToKitchenIdx];
                    if (!allSentToKitchen) {
                        // If item idx is something other than the last index of itemPresentInBill then, something is going wrong
                        // as we can only have 1 active instance of any item whose qty can be changed and is not sent to kitchen
                        if (itemNotSentToKitchenIdx !== (itemPresentInBill.length-1)) {
                            toast.error('Something is wrong with going with the billing system, please erase data and login again!');
                            return;
                        }
                        updatedBillItems[selectedOrder.id] = updatedBillItems[selectedOrder.id].map((billItem: any) => {
                            return {
                                ...billItem,
                                qty: billItem.idWithIndex === matchedItem.idWithIndex ? +matchedItem.qty + 1 : billItem.qty,
                            }
                        });
                        idWithIndex = matchedItem.idWithIndex;
                    } else {
                        /* allSentToKitchen is false, which mean all the items which are present in the bill are
                           all sent to kitchen already and cannot be modified again.
                           Thats why we are adding a new row for the same item in here
                        */
                        idWithIndex = `${item.id}____${itemPresentInBill.length}`;
                        updatedBillItems[selectedOrder.id].push({
                            ...item,
                            idWithIndex,
                            qty: 1,
                            kitchenInfo: '',
                            sentToKitchen: false,
                        });
                    }
                }
            }
            updatedBillingData(BillingDataKeys.BILL_ITEMS, updatedBillItems)
            updatedBillingData(BillingDataKeys.BILLING_PRICE_MAP,{
                ...totalBillingPrice,
                [selectedOrder.id]: totalBillingPrice[selectedOrder.id] ? totalBillingPrice[selectedOrder.id] + getNumber(item.sellingPrice) : getNumber(item.sellingPrice)
            })
            updatedBillingData(BillingDataKeys.BILL_SELECTED_ITEMS_MAP, {
                ...selectedItemMap,
                [selectedOrder.id]: {
                    ...item,
                    idWithIndex,
                },
            })
        } else if (selectedOrder?.isFreezed) {
            toast.info('Selected order cannot be updated, its freezed!');
        } else {
            toast.info('Please select an order to add menu items!');
        }
    }

    const updateQtyOfSelectedItem = (isAdd: boolean, qty: number) => {
        if (selectedOrder.id && !selectedOrder?.isFreezed) {
            let updatedBill = totalBillingPrice[selectedOrder.id];
            let updatedBillItems = {...billItems};
            updatedBillItems[selectedOrder.id] = billItems[selectedOrder.id].map((item: any) => {
                if (item.idWithIndex === selectedItemMap[selectedOrder.id]?.idWithIndex && !item.sentToKitchen) {
                    if (isAdd) {
                        item.qty += qty;
                        updatedBill += qty * getNumber(item.sellingPrice);
                    } else if (item.qty > 1) {
                        item.qty -= qty;
                        updatedBill -= qty * getNumber(item.sellingPrice);
                    } else {
                        toast.info('Cannot decrement below 1, use "Delete selected" to remove it! ')
                    }
                    return item;
                } else {
                    return item;
                }
            });
            updatedBillingData(BillingDataKeys.BILL_ITEMS, updatedBillItems)
            updatedBillingData(BillingDataKeys.BILLING_PRICE_MAP, {
                ...totalBillingPrice,
                [selectedOrder.id]: updatedBill,
            });
        } else if (selectedOrder?.isFreezed) {
            toast.info('Selected order cannot be updated, its freezed!');
        } else {
            toast.info('Please select an order & item to update its count!');
        }
    }

    const replaceQtyOfSelectedItem = (qty: number) => {
        if (selectedOrder.id && !selectedOrder?.isFreezed) {
            let updatedBill = totalBillingPrice[selectedOrder.id];
            const updatedBillItems = {...billItems};
            updatedBillItems[selectedOrder.id] = billItems[selectedOrder.id].map((item: any) => {
                if (item.idWithIndex === selectedItemMap[selectedOrder.id]?.idWithIndex && !item.sentToKitchen) {
                    const prevQty = item.qty;
                    item.qty = qty;
                    updatedBill += (qty - prevQty) * getNumber(item.sellingPrice);
                }
                return item;
            });
            updatedBillingData(BillingDataKeys.BILL_ITEMS, updatedBillItems)
            updatedBillingData(BillingDataKeys.BILLING_PRICE_MAP, {
                ...totalBillingPrice,
                [selectedOrder.id]: updatedBill,
            })

        } else if (selectedOrder?.isFreezed) {
            toast.info('Selected order cannot be updated, its freezed!');
        } else {
            toast.info('Please select an order & item to update its count!');
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
                replaceQtyOfSelectedItem(number); // should be replacing and not adding
                // reset timer value
                timer = 0;
                number = 0;
                setRecentDigits([]);
            }, 700);
        }
    }

    const getMenuItems = async (category: any) => {
        // fetch the items of category
        setSelectedCategory(category.id);
        const menuItemsRes = await MenuItemsBackendApiService.fetchMenuItemsByCategoryId(category.id);
        if (menuItemsRes && menuItemsRes.length) {
            setMenuItems(menuItemsRes);
        } else {
            toast.info(`No items are present in "${category.name}"`);
        }
    }

    const selectBillItem = (item: any) => {
        updatedBillingData(BillingDataKeys.BILL_SELECTED_ITEMS_MAP, {
            ...selectedItemMap,
            [selectedOrder.id]: item,
        })
    }

    const deleteSelectedBillItem = () => {
        // Check if item is already sent to kitchen if not Remove the billItem
        if (selectedOrder.id && selectedItemMap[selectedOrder.id]?.idWithIndex) {
            let foundSelectedItem: any = {};
            let updatedBillItems = {...billItems};
            updatedBillItems[selectedOrder.id] = updatedBillItems[selectedOrder.id].filter((item: any, idx: number) => {
                if (item.idWithIndex === selectedItemMap[selectedOrder.id]?.idWithIndex) {
                    foundSelectedItem = item;
                    return item.sentToKitchen
                } else {
                    return true;
                }
            });
            updatedBillingData(BillingDataKeys.BILL_ITEMS, updatedBillItems)
            // Can only delete selected item if its not sent to kitchen
            if (foundSelectedItem.id && !foundSelectedItem.sentToKitchen) {
                // If there was a selection made and it was removed then only update the selectedItem State
                const updatedSelectedItemMap = {
                    ...selectedItemMap,
                };
                delete updatedSelectedItemMap[selectedOrder.id];
                updatedBillingData(BillingDataKeys.BILL_SELECTED_ITEMS_MAP, updatedSelectedItemMap)
                // Now update the pricing state variable
                let updatedTotalPricing = {...totalBillingPrice};
                updatedTotalPricing[selectedOrder.id] -= (foundSelectedItem.qty * getNumber(foundSelectedItem.sellingPrice));
                updatedBillingData(BillingDataKeys.BILLING_PRICE_MAP, updatedTotalPricing)
                toast.info('Item removed from bill successfully!');
            } else if (foundSelectedItem.sentToKitchen) {
                toast.info('Item sent to kitchen cannot be deleted!');
            }
        } else {
            toast.info('There is no selected item to delete!')
        }
    }

    const handleAddBill = async () => {
        console.log(selectedOrder)
        if (!selectedOrder.id) {
            toast.error('Please select an order first!');
            return;
        }

        if (selectedOrder.type === 'ONLINE_ORDER' && !selectedOrder.customerId) {
            toast.error('For Online Orders, customer-info must be attached to the order!');
            return;
        }

        setIsBillingLoading(true);
        const orderName = selectedOrder.name.split('-')[0]; // removing the id from name in case of online order
        // Call API
        const billRes = await POSBackendApiService.addBill({
            methodOfPayment,
            menuItems: billItems[selectedOrder.id],
            orderName,
            orderType: selectedOrder.type,
            orderMetaData: {
                personsCount: selectedOrder.personsCount,
            },
            totalAmount: totalBillingPrice[selectedOrder.id],
            voided: false,
            customerId: selectedOrder.customerId,
        });
        if (billRes.success) {
            // Clear the selectedOrder info and make it available for next orders
            if (selectedOrder.type === 'DINE_IN') {
                const updatedTable = tablesList.map((table) => {
                    if (table.id === selectedOrder.id) {
                        return {
                            ...table,
                            isSelected: false,
                        }
                    }
                    return table;
                });
                updatedBillingData(BillingDataKeys.BILL_TABLES_LIST, updatedTable);
            }
            // Update the orders List
            const updatedOrdersList = orderList.filter((order: any) => order.id !== selectedOrder.id);
            updatedBillingData(BillingDataKeys.BILL_ORDERS, updatedOrdersList)

            // Removing the selectedOrders key from total price Map and Billing items Map
            let updatedBillItems = {...billItems};
            let updatedTotalBillingPrice = {...totalBillingPrice};
            delete updatedBillItems[selectedOrder.id];
            delete updatedTotalBillingPrice[selectedOrder.id];
            updatedBillingData(BillingDataKeys.BILL_ITEMS, updatedBillItems)
            updatedBillingData(BillingDataKeys.BILLING_PRICE_MAP, updatedTotalBillingPrice)
            updatedBillingData(BillingDataKeys.BILL_SELECTED_ITEMS_MAP, {});
            // Reset the selectedOrder object
            setSelectedOrder({});
            setIsBillingLoading(false);
            setIsBillingSuccess(true);
            message.success(`Bill Added Successfully!'`);
            toast.success(`Bill Added Successfully!'`);

            // Info about extra used material for the billing
            let infoString = '';
            Object.keys(billRes.data).map(mat => {
                infoString += `${mat} => ${billRes.data[mat]} units `
            });
            if (infoString) {
                message.info(`These material needs URGENT stock addition in the DEFAULT store: ${infoString}`, 5);
            }
        } else {
            setIsBillingLoading(false);
            setIsBillingSuccess(false);
        }
    }

    const deleteBill = async (notes: string) => {
        if (!selectedOrder.id) {
            toast.error('Please select a order first!');
            return;
        }

        // Check if there are no bill-items, if yes, simply remove the bill from list
        if (_.isEmpty(billItems[selectedOrder.id])) {
            if (selectedOrder.type === 'DINE_IN') {
                const updatedTable = tablesList.map((table) => {
                    if (table.id === selectedOrder.id) {
                        return {
                            ...table,
                            isSelected: false,
                        }
                    }
                    return table;
                });
                updatedBillingData(BillingDataKeys.BILL_TABLES_LIST, updatedTable);
            }
            // Update the orders List
            const updatedOrdersList = orderList.filter((order: any) => order.id !== selectedOrder.id);
            updatedBillingData(BillingDataKeys.BILL_ORDERS, updatedOrdersList)
            setSelectedOrder({});
            return;
        }

        if (selectedOrder.type === 'ONLINE_ORDER' && !selectedOrder.customerId) {
            toast.error('For Online Orders, customer-info must be attached to the order!');
            return;
        }

        setIsBillingLoading(true);
        const orderName = selectedOrder.name.split('-')[0]; // removing the id from name in case of online order

        // Call API
        const billRes = await POSBackendApiService.addBill({
            methodOfPayment: '',
            menuItems: billItems[selectedOrder.id],
            orderName,
            orderType: selectedOrder.type,
            orderMetaData: {},
            totalAmount: totalBillingPrice[selectedOrder.id],
            voided: true,
            notes,
            customerId: selectedOrder.customerId,
        });
        if (billRes.success) {
            // Clear the selectedOrder info and make it available for next orders
            if (selectedOrder.type === 'DINE_IN') {
                const updatedTable = tablesList.map((table) => {
                    if (table.id === selectedOrder.id) {
                        return {
                            ...table,
                            isSelected: false,
                        }
                    }
                    return table;
                });
                updatedBillingData(BillingDataKeys.BILL_TABLES_LIST, updatedTable);
            }
            // Update the orders List
            const updatedOrdersList = orderList.filter((order: any) => order.id !== selectedOrder.id);
            updatedBillingData(BillingDataKeys.BILL_ORDERS, updatedOrdersList)

            // Removing the selectedOrders key from total price Map and Billing items Map
            let updatedBillItems = {...billItems};
            let updatedTotalBillingPrice = {...totalBillingPrice};
            delete updatedBillItems[selectedOrder.id]
            delete updatedTotalBillingPrice[selectedOrder.id]
            setBillItems(updatedBillItems);
            updatedBillingData(BillingDataKeys.BILL_ITEMS, updatedBillItems);
            updatedBillingData(BillingDataKeys.BILLING_PRICE_MAP, updatedTotalBillingPrice)
            updatedBillingData(BillingDataKeys.BILL_SELECTED_ITEMS_MAP, {});
            setSelectedOrder({});
            setIsDeleteBillLoading(false);
            setIsDeleteBillSuccess(true);
            message.success(`VOID Bill Added Successfully!'`);
            toast.success(`VOID Bill Added Successfully!'`);
            // Info about extra used material for the billing
            let infoString = '';
            Object.keys(billRes.data).map(mat => {
                infoString += `${mat} => ${billRes.data[mat]} units `
            });
            if (infoString) {
                message.info(`These material needs URGENT stock addition in the DEFAULT store: ${infoString}`, 5);
            }
        } else {
            setIsDeleteBillLoading(false);
            setIsDeleteBillSuccess(false);
        }
    }

    const freezeBill = () => {
        const updatedOrdersList =  orderList.map((order: any) => ({
            ...order,
            isFreezed: order.id === selectedOrder.id ? true : order.isFreezed,
        }));

        updatedBillingData(BillingDataKeys.BILL_ORDERS, updatedOrdersList)
        toast.info(`Order for ${selectedOrder.name} cannot be edited now!`)
    }

    const scrollCategories = (listId: string, direction: string) => {
        const categoryList = document.getElementById(listId);
        if (direction === 'UP' && categoryList.scrollHeight > categoryList.scrollTop) {
            categoryList.scrollTop = categoryList.scrollTop + 85; // height of cell + margin
        } else if (direction === 'DOWN' && categoryList.scrollHeight > categoryList.scrollTop) {
            categoryList.scrollTop = categoryList.scrollTop - 85; // height of cell + margin
        }
    }

    const handleShowKitchenInfo = () => {
        setShowKitchenInfoModal(true);
    }

    const addKitchenInfo = (kitchenInfo: string) => {
        if (selectedOrder.id) {
            let updatedBillItems = {...billItems};
            updatedBillItems[selectedOrder.id] = updatedBillItems[selectedOrder.id].map((item: any) => {
                if (item.idWithIndex === selectedItemMap[selectedOrder.id]?.idWithIndex) {
                    return {
                        ...item,
                        kitchenInfo
                    }
                } else {
                    return {
                        ...item,
                    }
                }
            });
            updatedBillingData(BillingDataKeys.BILL_ITEMS, updatedBillItems);
        }

        updatedBillingData(BillingDataKeys.BILL_SELECTED_ITEMS_MAP, {
            ...selectedItemMap,
            [selectedOrder.id]: {
                ...selectedItemMap[selectedOrder.id],
                kitchenInfo,
            }
        })

        setShowKitchenInfoModal(false);
    }

    const sendInfoToKitchen = () => {
        if (selectedOrder.id) {
            let updatedBillItems = {...billItems};
            updatedBillItems[selectedOrder.id] = updatedBillItems[selectedOrder.id].map((item: any) => ({
                ...item,
                sentToKitchen: true
            }));
            updatedBillingData(BillingDataKeys.BILL_ITEMS, updatedBillItems);
            updatedBillingData(BillingDataKeys.BILL_SELECTED_ITEMS_MAP, {
                ...selectedItemMap,
                [selectedOrder.id]: {
                    ...selectedItemMap[selectedOrder.id],
                    sentToKitchen: true,
                }
            });

            // As the selecteditemMap can be updated if we switch to some other order, so just to make it persistent
            //  we need to add sentTokitchen status to ordersList as well
            const udpatedOrdersList = orderList.map((order: any) => {
                return {
                    ...order,
                    sentToKitchen: order.id === selectedOrder.id ? true : order.sentToKitchen,
                }
            });
            updatedBillingData(BillingDataKeys.BILL_ORDERS, udpatedOrdersList);
        }
    }

    return (
        <div>
            <div className="billing-page-main">
                <div className="billing-page-main-left">
                    <div className="billing-page-main-left-scrollBar">
                        <div className="tables-selection-bar">
                            <div className="upper-arrow" onClick={() => scrollCategories( 'order-list', 'UP')}/>
                            <ul className="list" id={'order-list'}>
                                {
                                    orderList.map((order: any) => {
                                        return (
                                            <li
                                                className={`menu-items ${order.id === selectedOrder.id ? 'active-item' : ''}`}
                                                key={order.id}
                                                onClick={() => setSelectedOrder(order)}
                                            >
                                                <span>{order.name}</span>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                            <div className="lower-arrow" onClick={() => scrollCategories( 'order-list', 'DOWN')}/>
                        </div>
                    </div>
                    <div className="display-screen">
                        <div className="billing-page-main-left-screen">
                            <div className="main-screen">
                                <ul className="item-details">
                                    <li className="item-header item">Item</li>
                                    <li className="item-header sent">Sent</li>
                                    <li className="item-header qty">Qty</li>
                                    <li className="item-header price">Price</li>
                                    <li className="item-header sub-total">Sub Total</li>
                                </ul>
                                {
                                    billItems[selectedOrder.id] && billItems[selectedOrder.id].map((item: any) => {
                                        return (
                                            <ul
                                                className={`item-details billing-items ${item.idWithIndex === selectedItemMap[selectedOrder.id]?.idWithIndex && 'active-item'}`}
                                                onClick={() => selectBillItem(item)}
                                                key={item.id} id={item.id}
                                            >
                                                <li className="item">{item.name}</li>
                                                <li className="sent">{item.sentToKitchen &&
                                                <CheckCircleTwoTone twoToneColor="#52c41a"/>}</li>
                                                <li className="qty">{item.qty}</li>
                                                <li className="price">{item.sellingPrice}</li>
                                                <li className="sub-total">{item.qty * item.sellingPrice}</li>
                                            </ul>
                                        )
                                    })

                                }
                            </div>
                            <div className="side-btn">
                                <ul className="item-btn">
                                    <li className="func-btn scan-btn">Scan</li>
                                    <li className="func-btn add-btn"
                                        onClick={() => updateQtyOfSelectedItem(true, 1)}>+
                                    </li>
                                    <li className="func-btn subtract-btn"
                                        onClick={() => updateQtyOfSelectedItem(false, 1)}>-
                                    </li>
                                    <li className={`func-btn kitchen-info-btn ${!selectedItemMap[selectedOrder.id]?.idWithIndex && 'disabled'}`}
                                        onClick={() => handleShowKitchenInfo()}
                                    >Kitchen Info
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="left-screen-footer">
                            <div className="footer-screen">
                                <b>{totalBillingPrice[selectedOrder.id] ? totalBillingPrice[selectedOrder.id] : '0.00'}</b>
                            </div>
                            <div className="footer-btn">
                                <span onClick={sendInfoToKitchen}>Send</span>
                            </div>
                        </div>
                        <div className="number-list">
                            {
                                digits.map(digit =>
                                    <span
                                        className={`${!selectedItemMap[selectedOrder.id]?.idWithIndex && 'disabled-digit'} ${recentDigits.includes(digit) && 'recent-digit'}`}
                                        onClick={updateQty}
                                        id={`${digit}`}
                                    >{digit}</span>
                                )
                            }
                        </div>
                    </div>
                </div>
                <div className="billing-page-main-right">
                    <div className="drinks-options">
                        <div className="drinks-option">
                            <ul className="drinks" id={'favorite-items-list'}>
                                {
                                    favoriteMenuItems.map((menuItem) => {
                                        return <li key={menuItem.id}
                                                   onClick={() => checkIfVariantPresent(menuItem)}>{menuItem.name}</li>
                                    })
                                }
                            </ul>
                        </div>
                        <div className="drinks-category">
                            <ul className="categories">
                                {
                                    menuItems.map((item) => {
                                        return (
                                            <li key={item.id} onClick={() => checkIfVariantPresent(item)}>
                                                {item.name}
                                            </li>
                                        );
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                    <div className="category-list">
                        <div className="list-content">
                            <div className="upper-arrow" onClick={() => scrollCategories( 'category-list', 'UP')}/>
                            <ul className="list" id={'category-list'}>
                                {
                                    menuCategories.map(item => {
                                        return (
                                            <li className={`menu-items ${item.id === selectedCategory ? 'active-item' : ''}`}
                                                key={item.id} onClick={() => getMenuItems(item)}>
                                                <b>{item.name}</b>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                            <div className="lower-arrow" onClick={() => scrollCategories('category-list', 'DOWN')}/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="billing-page-footer-content">
                <BillingFooterContent
                    tablesList={tablesList}
                    selectTable={addActiveTable}
                    selectTakeAway={addTakeAway}
                    selectOnlineOrder={addOnlineOrder}
                    billAmount={totalBillingPrice[selectedOrder.id]}
                    handleAddBill={handleAddBill}
                    deleteSelectedBillItem={deleteSelectedBillItem}
                    selectedOrder={selectedOrder}
                    selectedItemsInOrder={billItems[selectedOrder.id]}
                    deleteBill={deleteBill}
                    freezeBill={freezeBill}
                    methodOfPayment={methodOfPayment}
                    setMethodOfPayment={setMethodOfPayment}
                    attachCustomerToOrder={attachCustomerToOrder}
                    isBillingSuccess={isBillingSuccess}
                    isBillingLoading={isBillingLoading}
                    isDeleteBillSuccess={isDeleteBillSuccess}
                    isDeleteBillLoading={isDeleteBillLoading}
                />
            </div>
            {
                showKitchenInfoModal && (
                    <div className="kitchen-info-main">
                        <Overlay closeOverlay={() => setShowKitchenInfoModal(false)}>
                            <ViewKitchenInfo item={selectedItemMap[selectedOrder.id]} handleUpdate={addKitchenInfo}/>
                        </Overlay>
                    </div>
                )
            }
            {
                showMenuItemVariantsModal && (
                    <div className="kitchen-info-main">
                        <Overlay closeOverlay={() => setShowMenuItemVariantsModal(false)}>
                            <SelectVariantComponent
                                menuItem={selectedMenuItemToAdd}
                                selectVariant={handleVariantClick}
                                cancel={() => setShowMenuItemVariantsModal(false)}
                            />
                        </Overlay>
                    </div>
                )
            }
        </div>
    )
}

export default BillingMainContent;
