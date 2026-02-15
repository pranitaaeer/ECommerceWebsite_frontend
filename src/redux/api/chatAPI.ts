import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {ChatMessageRequest,ChatMessageResponse} from "../../types/api-types";

export const chatAPI = createApi({
  reducerPath: "chatAPI",
  baseQuery: fetchBaseQuery({ 
     baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/chat/`,
 }),
  endpoints: (builder) => ({
    sendMessage: builder.mutation<ChatMessageResponse, ChatMessageRequest>({
      query: ({ userId, message }) => ({
        url: `/new?id=${userId}`,
        method: "POST",
        body: { message },
      }),
    }),
  }),
});


export const { useSendMessageMutation } = chatAPI;
