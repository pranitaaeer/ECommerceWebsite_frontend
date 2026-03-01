
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
    ApplyDiscountRequest,
    ApplyDiscountResponse, 
    couponRequest,
    CouponResponse ,
    updateCouponRequest,
    deleteCouponRequest,
    getCouponRequest,
    SingleDiscountResponse
} from "../../types/api-types";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/payment/`,
  }),
  endpoints: (builder) => ({
    coupon:builder.mutation<CouponResponse,couponRequest>({
      query:({code,amount,userId})=>({
        url:`coupon/new?id=${userId}`,
        method:"POST",
        body:{code,amount}
      }),
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
      })
    }),
    deleteCoupon:builder.mutation<CouponResponse,deleteCouponRequest>({
      query:({id,userId})=>({
        url:`coupon/${id}?id=${userId}`,
        method:"DELETE"
      })
    }),
    getCoupon:builder.query<SingleDiscountResponse,getCouponRequest>({
      query:({id,userId})=>({
        url:`coupon/${id}?id=${userId}`,
        method:"GET"
      })
    })
  }),
});

export const {
  useCouponMutation,
  useApplyDiscountMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useGetCouponQuery
}=paymentApi

