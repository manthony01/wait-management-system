import { rest } from "msw";

const BACKEND_URL_DEV = "http://localhost:8000";

export const handlers = [
  rest.get(`${BACKEND_URL_DEV}/restaurant/:restaurant_id`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: req.params.restaurant_id,
        name: "MSW_TEST",
        comment: "TEST",
        tables: [],
        menuItems: [],
        staff: [],
        categories: [],
        orders: [],
      })
    );
  }),
  rest.get(`${BACKEND_URL_DEV}/restaurants`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: req.params.restaurant_id,
          name: "MSW_TEST",
          comment: "TEST",
          tables: [],
          menuItems: [],
          staff: [],
          categories: [],
          orders: [],
        },
      ])
    );
  }),
  rest.get(
    `${BACKEND_URL_DEV}/restaurant/:restaurant_id/menu`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json([
          {
            name: "MSWTEST",
            restaurantid: req.params.restaurant_id,
            orderindex: "MSW_TEST",
            id: "MSW_TEST",
            items: [],
          },
        ])
      );
    }
  ),

  rest.get(
    `${BACKEND_URL_DEV}/restaurant/:restaurant_id/menu`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json([
          {
            name: "MSWTEST",
            restaurantid: req.params.restaurant_id,
            orderindex: "MSW_TEST",
            id: "MSW_TEST",
            items: [],
          },
        ])
      );
    }
  ),
];
