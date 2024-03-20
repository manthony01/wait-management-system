import { waitManagementApi } from "./waitManagement";
import {
  type Restaurant,
  type MenuItem,
  type Category,
  type RestaurantCreate,
  type RestaurantTable,
  type StaffResponse,
  type StaffRequest,
  type Staff,
  LoyaltyProgram,
  LoyaltyUser,
} from "../types";

const managerApi = waitManagementApi.injectEndpoints({
  endpoints: (builder) => ({
    addRestaurant: builder.mutation<Restaurant, RestaurantCreate>({
      query: ({ ...body }) => ({
        url: `/manager/restaurant`,
        method: "POST",
        body,
      }),
      transformResponse: (response: Restaurant) => response,
      invalidatesTags: () => ["Restaurant"],
    }),
    addRestaurantTable: builder.mutation<RestaurantTable, RestaurantTable>({
      query: ({ ...body }) => ({
        url: `/manager/restaurant/table`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result) => [
        { type: "Restaurant", id: result?.restaurantid },
      ],
    }),
    updateCategory: builder.mutation<
      Category,
      Partial<Category> & Pick<Category, "id">
    >({
      query: ({ id, ...patch }) => ({
        url: `/manager/category/${id}`,
        method: "PATCH",
        body: patch,
      }),
      transformResponse: (response: Category) => response,
      invalidatesTags: (result) => [
        { type: "Restaurant", id: result?.restaurantid },
      ],
    }),
    updateMenuItem: builder.mutation<
      MenuItem,
      Partial<MenuItem> & Pick<MenuItem, "id">
    >({
      query: ({ id, ...patch }) => ({
        url: `/manager/menuItem/${id}`,
        method: "PATCH",
        body: patch,
      }),
      transformResponse: (response: MenuItem) => response,
      invalidatesTags: (result) => [
        { type: "Restaurant", id: result?.restaurantid },
      ],
    }),
    addCategory: builder.mutation<Category, Omit<Category, "id">>({
      query: ({ ...body }) => ({
        url: `/manager/category`,
        method: "POST",
        body,
      }),
      transformResponse: (response: Category) => response,
      invalidatesTags: (result) => [
        { type: "Restaurant", id: result?.restaurantid },
      ],
    }),
    deleteCategory: builder.mutation<Category, number>({
      query: (id) => ({
        url: `/manager/category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result) => [
        { type: "Restaurant", id: result?.restaurantid },
      ],
    }),
    addMenuItem: builder.mutation<
      MenuItem,
      Omit<Omit<MenuItem, "id">, "tags"> & { tags: number[] }
    >({
      query: ({ ...body }) => ({
        url: `/manager/menuItem`,
        method: "POST",
        body,
      }),
      transformResponse: (response: MenuItem) => response,
      invalidatesTags: (_result, _error, args) => [
        { type: "Restaurant", id: args.restaurantid },
      ],
    }),
    deleteMenuItem: builder.mutation<MenuItem, number>({
      query: (id) => ({
        url: `/manager/menuItem/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result) => [
        { type: "Restaurant", id: result?.restaurantid },
      ],
    }),
    uploadFile: builder.mutation<unknown, { file: File; url: string }>({
      query: ({ file, url }) => ({
        url,
        method: "PUT",
        body: file,
      }),
      invalidatesTags: () => ["Restaurant"],
    }),
    getAllStaff: builder.query<
      Staff[],
      { restaurant_id: number; role?: string }
    >({
      query: ({ restaurant_id, role }) => ({
        url: `/manager/restaurant/${restaurant_id}/staff${
          role !== undefined ? `?role=${role}` : ""
        }`,
      }),
      providesTags: (_result, _error, args) => [
        { type: "Restaurant", id: args.restaurant_id },
      ],
    }),
    addStaff: builder.mutation<StaffResponse, StaffRequest>({
      query: ({ restaurant_id, ...body }) => ({
        url: `/manager/restaurant/${restaurant_id}/staff`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, args) => [
        { type: "Restaurant", id: args.restaurant_id },
      ],
    }),
    deleteStaff: builder.mutation<StaffResponse, StaffRequest>({
      query: ({ restaurant_id, email, role }) => ({
        url: `/manager/staff/${email}?restaurant_id=${restaurant_id}`,
        method: "DELETE",
        body: {
          email,
          role,
        },
      }),
      invalidatesTags: (_result, _error, args) => [
        { type: "Restaurant", id: args.restaurant_id },
      ],
    }),
    createLoyaltyProgram: builder.mutation<LoyaltyProgram, LoyaltyProgram>({
      query: (body) => ({
        url: `/manager/loyaltyProgram`,
        method: "POST",
        body,
      }),
      invalidatesTags: () => ["Loyalty"],
    }),
    getLoyaltyUsers: builder.query<LoyaltyUser[], number>({
      query: (restaurant_id) =>
        `/manager/loyaltyProgram/${restaurant_id}/users`,
      providesTags: () => ["Loyalty"],
    }),
  }),
});

export const {
  useAddRestaurantMutation,
  useAddRestaurantTableMutation,
  useUpdateCategoryMutation,
  useUpdateMenuItemMutation,
  useAddCategoryMutation,
  useAddMenuItemMutation,
  useUploadFileMutation,
  useDeleteMenuItemMutation,
  useDeleteCategoryMutation,
  useGetAllStaffQuery,
  useAddStaffMutation,
  useDeleteStaffMutation,
  useCreateLoyaltyProgramMutation,
  useGetLoyaltyUsersQuery,
} = managerApi;
