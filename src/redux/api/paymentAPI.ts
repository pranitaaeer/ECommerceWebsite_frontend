
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
    ApplyDiscountRequest,
    ApplyDiscountResponse, 
    couponRequest,
    CouponResponse ,
    updateCouponRequest,
    deleteCouponRequest,
    getCouponRequest,
    SingleDiscountResponse,
    AllDiscountResponse,
    allCouponsRequest
} from "../../types/api-types";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/payment/`,
  }),
  tagTypes: ["coupons"],
  endpoints: (builder) => ({
    coupon:builder.mutation<CouponResponse,couponRequest>({
      query:({code,amount,userId})=>({
        url:`coupon/new?id=${userId}`,
        method:"POST",
        body:{code,amount}
      }),
      invalidatesTags:["coupons"]
    }),
    applyDiscount:builder.mutation<ApplyDiscountResponse,ApplyDiscountRequest>({
      query:({coupon})=>({
        url:`discount?coupon=${coupon}`,
        method:"POST",
      }),
    }),
    updateCoupon:builder.mutation<CouponResponse,updateCouponRequest>({
      query:({code,amount,userId,id})=>({
        url: `coupon/${id}?id=${userId}`,
        method:"PUT",
        body:{code,amount}
      }),
      invalidatesTags:["coupons"]
    }),
    deleteCoupon:builder.mutation<CouponResponse,deleteCouponRequest>({
      query:({id,userId})=>({
        url:`coupon/${id}?id=${userId}`,
        method:"DELETE"
      }),
      invalidatesTags:["coupons"]
    }),
    getCoupon:builder.query<SingleDiscountResponse,getCouponRequest>({
      query:({id,userId})=>({
        url:`coupon/${id}?id=${userId}`,
        method:"GET"
      }),
      providesTags:["coupons"]
    }),
    getAllcoupons:builder.query<AllDiscountResponse,allCouponsRequest>({
      query:({userId})=>({
        url:`coupon/all?id=${userId}`,
        method:"GET",
      }),
      providesTags:["coupons"]
    })
  }),
});

export const {
  useCouponMutation,
  useApplyDiscountMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useGetCouponQuery,
  useGetAllcouponsQuery
}=paymentApi

