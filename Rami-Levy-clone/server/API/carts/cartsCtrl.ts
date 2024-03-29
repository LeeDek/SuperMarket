import express from "express";
import connection from "../../DB/database";

//in DB: cart_id, list_id, user_id, status_id
export const getUserActiveCart = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { user_id } = req.params;
    if (!user_id) {
      res.status(400).send({ ok: false, error: "missing required fields" });
      return;
    }

    // Check if the user has an active cart
    const checkQuery =
      "SELECT * FROM rami_levy_db.carts WHERE user_id = ? AND status_id = 1;";
    connection.query(checkQuery, [user_id], (err, results, fields) => {
      try {
        if (err) throw err;
        //@ts-ignore
        if (results.length > 0) {
          // User has an active cart, send the results
          res.send({ ok: true, results });
        } else {
          // User doesn't have an active cart, create a new one
          const insertQuery =
            "INSERT INTO rami_levy_db.carts (user_id, status_id) VALUES (?, ?);";
          connection.query(
            insertQuery,
            [user_id, 1],
            (err, results, fields) => {
              try {
                if (err) throw err;
                // Select the newly inserted cart
                const selectQuery =
                  "SELECT * FROM rami_levy_db.carts WHERE user_id = ? AND status_id = 1;";
                connection.query(
                  selectQuery,
                  [user_id],
                  (err, results, fields) => {
                    try {
                      if (err) throw err;
                      res.send({ ok: true, results });
                    } catch (error) {
                      console.error(error);
                      res.status(500).send({ ok: false, error });
                    }
                  }
                );
              } catch (error) {
                console.error(error);
                res.status(500).send({ ok: false, error });
              }
            }
          );
        }
      } catch (error) {
        console.error(error);
        res.status(500).send({ ok: false, error });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ ok: false, error });
  }
};

export const getUserActiveCartList = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { cart_id } = req.params;
    if (!cart_id) {
      res.status(400).send({ ok: false, error: "missing required fields" });
      return;
    }
    const query = `
        SELECT l.*, p.*,pi.* FROM lists l
        INNER JOIN products p
        ON l.product_id = p.product_id
        INNER JOIN products_images pi
        ON pi.product_id=p.product_id
        WHERE l.cart_id = ?;
        `;
    connection.query(query, [cart_id], (err, results, fields) => {
      try {
        if (err) throw err;
        res.send({ ok: true, results });
      } catch (error) {
        console.error(error);
        res.status(500).send({ ok: false, error });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ ok: false, error });
  }
};
export const addNewCart = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { user_id } = req.body;
    if (!user_id) {
      res.status(400).send({ ok: false, error: "missing required fields" });
      return;
    }
    const query =
      "INSERT INTO rami_levy_db.carts (user_id, status_id) VALUES (?, ?);";
    connection.query(query, [user_id, 1], (err, results, fields) => {
      try {
        if (err) throw err;
        //select inserted cart
        const query =
          "SELECT * FROM  rami_levy_db.carts WHERE user_id = ? AND status_id = 1;";
        connection.query(query, [user_id], (err, results, fields) => {
          try {
            if (err) throw err;
            res.send({ ok: true, results });
          } catch (error) {
            console.error(error);
            res.status(500).send({ ok: false, error });
          }
        });
      } catch (error) {
        console.error(error);
        res.status(500).send({ ok: false, error });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ ok: false, error });
  }
};

export const addProductToCartList = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { product_id, cart_id } = req.body;
    if (!product_id || !cart_id) {
      res.status(400).send({ ok: false, error: "missing required fields" });
      return;
    }
    const query =
      "INSERT INTO rami_levy_db.lists (product_id, cart_id, product_amount) VALUES (?, ?, ?);";
    connection.query(
      query,
      [product_id, cart_id, 1],
      (err, results, fields) => {
        try {
          if (err) throw err;
          res.send({ ok: true, results });
        } catch (error) {
          console.error(error);
          res.status(500).send({ ok: false, error });
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send({ ok: false, error });
  }
};
export const UpdateAmountProductCartList = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { product_id, cart_id, product_amount } = req.body;

    if (!product_id || !cart_id) {
      res.status(400).send({ ok: false, error: "missing required fields" });
      return;
    }
    let query;
    if (product_amount == 0) {
      query =
        "DELETE FROM rami_levy_db.lists WHERE product_id = ? AND cart_id = ?;";
      connection.query(query, [product_id, cart_id], (err, results, fields) => {
        try {
          if (err) throw err;
          res.send({ ok: true, results });
        } catch (error) {
          console.error(error);
          res.status(500).send({ ok: false, error });
        }
      });
    } else {
      query =
        "UPDATE rami_levy_db.lists SET product_amount = ? WHERE product_id = ? AND cart_id = ?;";
      connection.query(
        query,
        [product_amount, product_id, cart_id],
        (err, results, fields) => {
          try {
            if (err) throw err;
            res.send({ ok: true, results });
          } catch (error) {
            console.error(error);
            res.status(500).send({ ok: false, error });
          }
        }
      );
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ ok: false, error });
  }
};

export const getAllCarts = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const query = "SELECT * FROM  rami_levy_db.carts;";
    connection.query(query, (err, results, fields) => {
      try {
        if (err) throw err;
        res.send({ ok: true, results });
      } catch (error) {
        console.error(error);
        res.status(500).send({ ok: false, error });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ ok: false, error });
  }
};

export const getCartById = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { cart_id } = req.params;
    if (!cart_id) {
      res.status(400).send({ ok: false, error: "missing required fields" });
      return;
    }
    const query = "SELECT * FROM  rami_levy_db.carts WHERE cart_id = ?;";
    connection.query(query, [cart_id], (err, results, fields) => {
      try {
        if (err) throw err;
        res.send({ ok: true, results });
      } catch (error) {
        console.error(error);
        res.status(500).send({ ok: false, error });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ ok: false, error });
  }
};

export const deleteCart = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { cart_id } = req.params;
    if (!cart_id) {
      res.status(400).send({ ok: false, error: "missing required fields" });
      return;
    }
    const query = "DELETE FROM rami_levy_db.carts WHERE cart_id = ?;";
    connection.query(query, [cart_id], (err, results, fields) => {
      try {
        if (err) throw err;
        res.send({ ok: true, results });
      } catch (error) {
        console.error(error);
        res.status(500).send({ ok: false, error });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ ok: false, error });
  }
};

export const updateCartStatus = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { cart_id, status_id } = req.body;
    if (!cart_id || !status_id) {
      res.status(400).send({ ok: false, error: "missing required fields" });
      return;
    }
    const query =
      "UPDATE rami_levy_db.carts SET status_id = ? WHERE cart_id = ?;";
    connection.query(query, [status_id, cart_id], (err, results, fields) => {
      try {
        if (err) throw err;
        res.send({ ok: true, results });
      } catch (error) {
        console.error(error);
        res.status(500).send({ ok: false, error });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ ok: false, error });
  }
};
