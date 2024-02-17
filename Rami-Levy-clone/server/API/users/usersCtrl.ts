
//usersCtrl.ts   server side    

import express from 'express';
import connection from "../../DB/database";
import { RowDataPacket } from 'mysql2';
import bcrypt from 'bcryptjs'; // Import bcrypt
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { Request, Response } from 'express';



const saltRounds = 10; 

export const getAllUsers = async (req: express.Request, res: express.Response) => {
  try {
// select users and users roles from users table and roles table

    const query = "SELECT * FROM users INNER JOIN roles ON users.role_id = roles.role_id";
    connection.query(query, (err, results, fields) => {
      try {
        if (err) throw err;
        res.send({ ok: true, results })
      } catch (error) {
        console.error(error)
        res.status(500).send({ ok: false, error })
      }
    })


   
  } catch (error) {
    console.error(error)
    res.status(500).send({ ok: false, error })
  }
}
export const registerUser = async (req: express.Request, res: express.Response) => {
  try {
    const { email,id_number, password, first_name, last_name,  role_id } = req.body;
    console.log(req.body)
    if (!email || !password || !first_name || !last_name || !role_id) {
      throw new Error("Missing fields");
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds); // Hash password
    const query = "INSERT INTO users (email,id_number, password, first_name, last_name,  role_id) VALUES (?,?,?,?,?,?)";
    connection.query(query, [email,id_number, hashedPassword, first_name, last_name, role_id], (err, results, fields) => {
      try {
        if (err) throw err;
        res.send({ ok: true, results })
      } catch (error) {
        console.error(error)
        res.status(500).send({ ok: false, error })
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).send({ ok: false, error })
  }
}
export const loginUser = async (req: express.Request, res: express.Response) => {
  try {
    
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).send({ ok: false, error: 'Missing email or password loginUser()' });
      return;
    }
    const query = `SELECT * FROM users INNER JOIN roles ON users.role_id = roles.role_id WHERE email = ?;`;

    connection.query(query, [email], async (err, results: RowDataPacket[], fields) => {
      try {
        if (err) throw err;

        if (results.length === 0) {
          // No user found with the provided email
          res.status(401).send({ ok: false, error: 'no mach email loginUser()' });
        } else {
          // User found, compare passwords
          const user = results[0] ;

          // Compare the entered password with the stored hashed password
          const passwordMatch = await bcrypt.compare(password, user.password);

          if (passwordMatch) {
            const secret = process.env.SECRET_KEY
            const cookie = { user_id: user.user_id }
            const token = jwt.sign(cookie, secret, {
              expiresIn: '3h', // Set the expiration time as needed
            });

            // Set the token in a cookie
            res.cookie('token', token, { httpOnly: true, maxAge: 6600000 });
            res.send({ ok: true, user });
          } else {
            // Passwords don't match
            res.status(401).send({ ok: false, error: 'Invalid credentials' });
          }
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
export const logOutUser = async (req: express.Request, res: express.Response) => {
  try {
    res.clearCookie('token');
    res.send({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({ ok: false, error });
  }
}
export const getUserFromToken = async (req: express.Request, res: express.Response) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      // No token, no user connected
      res.send({ ok: true, user: null });
      return;
    }
    const secret = process.env.SECRET_KEY;
    if (!secret) {
      throw new Error("No secret key available");
    }

    const decoded = jwt.verify(token, secret) as { user_id: number };
    const { user_id } = decoded;
    const query = `SELECT * FROM users WHERE user_id = ?;`;
    connection.query(query, [user_id], (err, results: RowDataPacket[], fields) => {
      try {
        if (err) throw err;
        const user = results[0];
        res.send({ ok: true, user });
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
export const updateUserRole = async (req: express.Request, res: express.Response) => {
  try {
    const { user_id, role_id } = req.body;
    if (!user_id || !role_id) {
      throw new Error("Missing fields");
    }
    const query = "UPDATE users SET role_id = ? WHERE user_id = ?";
    connection.query(query, [role_id, user_id], (err, results, fields) => {
      try {
        if (err) throw err;
        res.send({ ok: true, results })
      } catch (error) {
        console.error(error)
        res.status(500).send({ ok: false, error })
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).send({ ok: false, error })
  }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
  try {
    const user_id = req.params.user_id;
    if (!user_id) {
      throw new Error("Missing fields");
    }
    const query = "DELETE FROM users WHERE user_id = ?";
    connection.query(query, [user_id], (err, results, fields) => {
      try {
        if (err) throw err;
        res.send({ ok: true, results })
      } catch (error) {
        console.error(error)
        res.status(500).send({ ok: false, error })
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).send({ ok: false, error })
  }
}

export const updatePassword = async (req: Request, res: Response) => {
  try {
    const { user_id, password } = req.body;
    if(!user_id || !password  ){  
      res.status(400).send({ ok: false, error: 'Missing user_id or password' });
      return;
    }
    // Hash the new password
    const hash = await bcrypt.hash(password, saltRounds);

    // Update the user's password in the database
    const query = `
      UPDATE party_maker.users
      SET password = ?
      WHERE user_id = ?;
    `;
    connection.query(query, [hash, user_id], (err, results: any, fields) => {
      if (err) {
        console.error(err);
        res.status(500).send({ ok: false, error: 'Failed to update password' });
        return;
      }
      res.send({ ok: true, message: 'Password updated successfully' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ ok: false, error: 'Internal server error' });
  }
};
