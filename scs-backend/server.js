const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
var crypto = require('crypto');

const app = express();
const port = 3000;

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "projectdatabase"
});

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

function getAllRows(tableName) {
    return new Promise((resolve, reject) => {
        con.query("select * from " + tableName, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
            
        });
    })
}

function getRowCount(tableName) {
    return new Promise((resolve, reject) => {
        con.query("select count(*) from " + tableName, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    })
}

con.connect(function(err) {
    if (err) {
        return res.json({ status: "ERR", err });
    };
});

app.get('/', (req, res) => {
    res.send('SCS backend API');
});

app.get('/api/items', async (req, res) => {
    const result = await getAllRows("Item").catch(err => {
        return res.json({status: "ERR", err});
    });
    return res.json(result);
});

app.get('/api/coupon', async (req, res) => {
    const result = await getAllRows("Coupon").catch(err => {
        return res.json({status: "ERR", err});
    });
    return res.json(result);
})

app.get('/api/stores', async (req, res) => {
    const result = await getAllRows("Store").catch(err => {
        return res.json({status: "ERR", err});
    });
    return res.json(result);
})

app.get('/api/store/:storeId', (req, res) => {
    const storeId = req.params.storeId;
    con.query("select * from Store where StoreID = ?", [storeId], (err, rows) => {
        if (err) {
            return res.json({ status: "ERR", err });
        };
        return res.json({status: "OK", info: rows});
    })
})

app.get('/api/reviews', async (req, res) => {
    try {
        const result = await getAllRows("Product_Reviews");
        const countResult = await getRowCount("Product_Reviews");
        const count = countResult[0]["count(*)"];
        return res.json({ status: "OK", result, count });
    } catch (err) {
        return res.json({ status: "ERR", err });
    }
});

app.get('/api/invoice/:orderId', (req, res) => {
    const orderId = req.params.orderId;

    con.query(
        "SELECT * FROM order_info o INNER JOIN shopping s ON o.OrderID = s.OrderID INNER JOIN trip t ON o.OrderID = t.OrderID LEFT JOIN item i ON s.ItemID = i.ItemID  LEFT JOIN STORE store ON s.StoreID = store.StoreID WHERE o.OrderID = ?",
        [orderId], 
        (err, rows) => {
        if (err) {
            return res.json({ status: "ERR", err });
        };
        return res.json(rows);
    })
})

app.post('/api/checkout', (req, res) => {
    //console.log(req.body)
    var cart = req.body.cartItems;
    const subtotal = req.body.subtotal;
    const store = parseInt(req.body.storeId);
    const destAddress = req.body.destAddress;
    const destCity = req.body.destCity;
    const destProvince = req.body.destProvince;
    const destPostcode = req.body.destPostcode;
    const user = parseInt(req.body.userId);
    const couponId = req.body.coupon.CouponID;

    var orderQuery = "";
    var orderValues = [];
    if (couponId != 0) {
        orderQuery = "insert into order_info (Subtotal, PaymentCode, UserID, CouponID) values (?, 1, ?, ?)";
        orderValues = [subtotal, user, couponId];
    } else {
        orderQuery = "insert into order_info (Subtotal, PaymentCode, UserID) values (?, 1, ?)";
        orderValues = [subtotal, user];
    }

    con.query(orderQuery, orderValues, function (err, result, fields) {
        if (err) {
            return res.json({ status: "ERR", err });
        } else {
            const orderId = result.insertId;
            
            var shoppingRows = []
            for (let item of cart) {
                shoppingRows.push([orderId, store, item["item"], item["quantity"], item["size"]])
            }

            con.query("insert into shopping (OrderID, StoreID, ItemID, OrderQuantity, ItemSize) values ?", [shoppingRows], (err) => {
                if (err) {
                    return res.json({status: "ERR", err})
                } else {
                    con.query(
                        "insert into trip (OrderID, StoreID, DestAddress, DestCity, DestProvince, DestPostcode) values (?, ?, ?, ?, ?, ?)",
                        [orderId, store, destAddress, destCity, destProvince, destPostcode],
                        (err, result, fields) => {
                            if (err) {
                                return res.json({status: "ERR", err})
                            } /* else {
                                con.query(
                                    "update order_info set TripID = ? where OrderID = ?", 
                                    [result.insertId, orderId],
                                    (err) => {
                                        if (err) {
                                            return res.json({status: "ERR", err})
                                        }
                                    }
                                )
                            } */
                        }
                    )
                }
            })

            return res.json({status: "OK", "orderId": orderId});
        }
    })
})

app.post('/api/cart', (req, res) => {
    const user = req.body.user;

    con.query('select * from shopping_cart c inner join item i on c.ItemID = i.ItemID where c.UserID=?', [user], (err, info) => {
        if (err) {
            return res.json({ status: "ERR", err });
        } else {
            return res.json({ status: "OK", info });
        }
    })
})

app.post('/api/cart/add', (req, res) => {
    const user = req.body.user;
    const item = req.body.item;
    const size = req.body.size;
    const quant = req.body.quantity;

    con.query(
        'insert into shopping_cart (UserID, ItemID, Quantity, ItemSize) values (?,?,?,?)',
        [user, item, quant, size],
        (err, info) => {
            if (err) {
                return res.json({ status: "ERR", err });
            } else {
                return res.json({ status: "OK", info });
            }
        }
    )
})

app.post('/api/cart/delete', (req,res) => {
    const user = req.body.user;
    const item = req.body.item;
    const size = req.body.size;

    con.query(
        'delete from shopping_cart where UserID=? and ItemID=? and ItemSize=?',
        [user, item, size],
        (err, info) => {
            if (err) {
                return res.json({ status: "ERR", err });
            } else {
                return res.json({ status: "OK", info });
            }
        }
    );
})

app.post('/api/cart/deleteAll', (req,res) => {
    const user = req.body.user;
    con.query('delete from shopping_cart where UserID = ?', [user], (err, info) => {
        if (err) {
            return res.json({ status: "ERR", err });
        } else {
            return res.json({ status: "OK", info });
        }
    })
})

// login/signup
function createHash(input, salt) {
    return crypto.createHash("md5").update(input + salt).digest('hex');
}

function validateHash(currentp, dbhash, salt) {
    const hashed = createHash(currentp, salt);
    return hashed === dbhash ? true : false;
}

/* app.get('/pwtest', (req, res) => {
    const salt = crypto.randomBytes(16).toString('base64');
    const result = createHash("andrew123", salt);
    res.send([result, salt]);
})

app.post('/pwtest2', (req, res) => {
    const pw = req.body.password;
    const salt = req.body.salt;
    const hash = req.body.hash;
    res.send({password: pw, match: validateHash(pw, hash, salt)});
}) */

app.post('/api/signup', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.telephone;
    const address = req.body.streetaddr;
    const postcode = req.body.postcode;

    const salt = crypto.randomBytes(16).toString('base64');
    const password = createHash(req.body.password, salt);

    const insertQuery = 'INSERT INTO user_info (UserName, Phone, Email, UserAddress, CityCode, PW, Salt) VALUES (?, ?, ?, ?, ?, ?, ?)';
    con.query(insertQuery, [name, phone, email, address, postcode, password, salt],
        function (err, rows) {
            if (err) {
                return res.json({ status: "ERR", err });
            };

            return res.json({status: "OK"});
        }
    );
});


app.post('/api/add-review', (req, res) => {
    var product = req.body.product;
    var title = req.body.title;
    var review = req.body.review;
    var rating = req.body.rating;
    var username = req.body.username;
    var userid = req.body.userid;

    const insertQuery = 'INSERT INTO product_reviews (product_name, review_title, review_text, rating, name, user_id) VALUES (?, ?, ?, ?, ?, ?)';
    con.query(insertQuery, [product, title, review, rating, username, userid],
        function (err, rows) {
            if (err) {
                return res.json({status: "ERR", err});
            };
            return res.json({status: "OK"});
        }
    );
});
app.post('/api/login', (req, res) => {
    const email = req.body.email;
    const loginPw = req.body.password;

    con.query('SELECT * FROM user_info WHERE Email = ?', [req.body.email], function (err, rows) {
        if (err) {
            return res.json({ status: "ERR", err });
        };

        if (rows && rows.length > 0) {
            // emails are unique

            const existingHash = rows[0].PW;
            const salt = rows[0].Salt;

            if (validateHash(loginPw, existingHash, salt)) {
                delete rows[0].PW;
                delete rows[0].Salt;
                return res.json(rows)
            } else {
                res.status(400).send('Invalid password')
            }
        } else {
            res.status(400).send('Account with this email does not exist');
        }
    });
});

app.post('/api/signup/exists', (req, res) => {
    var email = req.body.email;
    con.query('SELECT * FROM user_info WHERE email = ?', [email], function (err, rows) {
        if (err) {
            return res.json({ status: "ERR", err });
        };

        if (rows && rows.length > 0) {
            return res.json({ status: "User with this email already exists" });
        } else {
            return res.json({ status: "OK" });
        }
    });
});

// admin apis
app.get('/api/admin/all', (req, res) => {
    con.query("SELECT table_name FROM information_schema.tables WHERE table_schema ='projectdatabase'",
    (err, rows) => {
        if (err) {
            return res.json({ status: "ERR", err });
        };
        const tableNames = rows.map(row => {
            return row.table_name;
        })
        //console.log(tableNames)
        return res.json({tables: tableNames});
    })
})

app.post('/api/admin/cols', (req, res) => {
    con.query("show columns from " + req.body.table, (err, rows) => {
        if (err) {
            return res.json({ status: "ERR", err });
        };
        const cols = rows.map(row => {
            return row.Field;
        })
        //console.log(cols)
        return res.json({columns: cols});
    })
})

// select/delete
app.post('/api/admin/query', (req, res) => {
    var query = req.body.query;
    con.query(query, function (err, rows) {
        if (err) {
            return res.json({ status: "ERR", err });
        };
        return res.json({status: "OK", info: rows});
    })
})

app.post('/api/admin/insert', (req, res) => {
    const table = req.body.table;
    const cols = Object.keys(req.body.cols);
    const vals = Object.values(req.body.cols);

    var inputs = [];
    vals.forEach(i => inputs.push("?"));

    let query = `insert into ${table} (${cols.join()}) values (${inputs.join(",")})`;
    con.query(query, vals, (err, rows) => {
        if (err) {
            return res.json({ status: "ERR", err });
        };
        return res.json({status: "OK", info: rows});
    })
})

app.post('/api/admin/update', (req, res) => {
    const table = req.body.table;
    const cols = Object.keys(req.body.cols);
    const vals = Object.values(req.body.cols);
    const where = req.body.where;

    let query = `update ${table} set ${cols.join("=?,")}=? where ${where}`
    con.query(query, vals, (err, rows) => {
        if (err) {
            return res.json({ status: "ERR", err });
        };
        return res.json({status: "OK", info: rows});
    })
})

app.listen(port, () => {
    console.log(`SCS backend listening on port ${port}`)
})