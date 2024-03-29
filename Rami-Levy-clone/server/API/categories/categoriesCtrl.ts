import { Request, Response } from "express";
import connection from "../../DB/database";

export const getFoodCategories = async (req: Request, res: Response) => {
  try {
    const query = "SELECT * FROM rami_levy_db.food_categories;";
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

//get food categories by sub food category id
export const getFoodCategoriesBySubFoodCategoryId = async (
  req: Request,
  res: Response
) => {
  try {
    const { sub_food_category_id } = req.params;
    if (!sub_food_category_id) {
      res.status(400).send({ ok: false, error: "missing required fields" });
      return;
    }
    const query = `
    SELECT food_categories.food_category_id 
    FROM food_categories 
    JOIN sub_food_categories 
    ON food_categories.food_category_id = sub_food_categories.food_category_id 
    WHERE sub_food_categories.sub_food_category_id = ?;
`;

    connection.query(query, [sub_food_category_id], (err, results, fields) => {
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

export const getSUBFoodCategories = async (req: Request, res: Response) => {
  try {
    const query =
      "SELECT sub_food_categories.sub_food_category_id,sub_food_categories.sub_food_category_name,sub_food_categories.food_category_id,sub_food_categories.navbar_item_id,food_categories.food_category_name FROM sub_food_categories JOIN  food_categories ON sub_food_categories.food_category_id = food_categories.food_category_id;";
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
export const addNewFoodCategory = async (req: Request, res: Response) => {
  try {
    const { food_category_name } = req.body;
    if (!food_category_name) {
      res.status(400).send({ ok: false, error: "missing required fields" });
      return;
    }
    const query = "INSERT INTO food_categories (food_category_name) VALUES (?)";
    connection.query(query, [food_category_name], (err, results, fields) => {
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

export const addNewSubFoodCategory = async (req: Request, res: Response) => {
  try {
    const { sub_category_name, food_category_id, navbar_item_id } = req.body;
    if (!sub_category_name || !food_category_id || !navbar_item_id) {
      res.status(400).send({ ok: false, error: "missing required fields" });
      return;
    }
    const query =
      "INSERT INTO sub_food_categories (sub_food_category_name,food_category_id,navbar_item_id) VALUES (?,?,?)";
    connection.query(
      query,
      [sub_category_name, food_category_id, navbar_item_id],
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
