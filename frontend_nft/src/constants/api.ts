/*
Project : Cryptotrades
FileName :  api.ts
Author : Ha
File Created : 2/07/2023
CopyRights : Ha
Purpose : This is the file which contain all api constants used in the application 
*/
export const API = {
    server_url: "http://localhost:5002",
    ipfs_url: "https://ipfs.io/ipfs/",
    cookie_expire: 60,  //1h
    user_login: "/user/login",
    user_opt_verify: "/user/opt_verify",
    user_profile_image: "/images/user/",
    user_profile_image_upload: '/media/avatar',
    user_update: "/user/update",

    collection_add: "/collection/add",
    collection_update: "/collection/update",
    collection_detail: "/collection/detail",
    collection_delete: "/collection/delete",    
    collection_list: "/collection/list",    
    collection_image: "/images/collection/logo/",
    collection_image_upload: '/media/collectionlogo',

    item_add: "/item/add",
    item_list: "/item/list",
    item_getItem: "/item/getItem",

    item_fractionAdd: "/item/fractionAdd",
    item_fracList: "/item/fractionList",
    item_fracMarketList: "/item/fractionMarketList",
    item_fractionGet: "/item/fractionGet",
    item_createOrder: "/item/createOrder",
    item_updateOrder: "/item/updateOrder",
    item_tradeOrder: "/item/tradeOrder",
    item_listOrder: "/item/listOrder",
    item_listBuyPrices: "/item/listBuyPrices",
    item_listSellPrices: "/item/listSellPrices"
}