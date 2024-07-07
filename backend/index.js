const express = require('express');
const cors = require('cors');
const { Connection, Request,TYPES } = require('tedious');

const bodyParser = require('body-parser');

const app = express();
const port = 3000;

var config = {
    server: "LAPTOP-BH5K91S6\\SQLEXPRESS",
    authentication: {
      type: "default",
      options: {
        userName: "aaron",
        password: "admin"
      }
    },
    options: {
      port: 1433,
      database: "tambo",
      trustServerCertificate: true
    }
}

app.use(bodyParser.json());
app.use(cors());

app.get('/productos', (req, res) => {
    const connection = new Connection(config);

    connection.connect();

    connection.on('connect', (err) => {
        if (err) {
            console.log("Error al conectarse a la base de datos");
            return res.status(500).send("Error al conectarse a la base de datos");
        }
        executeProductsQuery(connection, res);
    });
});

function executeProductsQuery(connection, res) {
    const request = new Request("SELECT * FROM productos", (err, rowCount) => {
        if (err) {
            connection.close();
            return res.status(500).send("Error en la ejecución de la consulta");
        }
        connection.close();
    });

    const results = [];

    request.on('row', (columns) => {
        const result = {};
        columns.forEach(column => {
            result[column.metadata.colName] = column.value;
        });
        results.push(result);
    });

    request.on('requestCompleted', () => {
        res.json(results);
    });

    connection.execSql(request);
}

app.post('/carrito', (req, res) => {
    const { id_producto, nombre, precio } = req.body;
    const connection = new Connection(config);

    connection.connect();

    connection.on('connect', (err) => {
        if (err) {
            console.log("Error al conectarse a la base de datos");
            return res.status(500).send("Error al conectarse a la base de datos");
        }

        // Verificar si el producto ya está en el carrito
        const checkQuery = `SELECT * FROM carrito WHERE id_producto = ${id_producto}`;
        const checkRequest = new Request(checkQuery, (err, rowCount) => {
            if (err) {
                connection.close();
                return res.status(500).send("Error en la ejecución de la consulta");
            }

            if (rowCount > 0) {
                // Producto ya existe, actualizar cantidad
                const updateQuery = `UPDATE carrito SET cantidad = cantidad + 1 WHERE id_producto = ${id_producto}`;
                executeQuery(connection, updateQuery, res, "Cantidad actualizada exitosamente");
            } else {
                // Producto no existe, insertar nuevo registro
                const insertQuery = `INSERT INTO carrito (id_producto, nombre, precio, cantidad) VALUES (${id_producto}, '${nombre}', ${precio}, 1)`;
                executeQuery(connection, insertQuery, res, "Producto agregado al carrito exitosamente");
            }
        });

        connection.execSql(checkRequest);
    });
});

function executeQuery(connection, query, res, successMessage) {
    const request = new Request(query, (err, rowCount) => {
        if (err) {
            connection.close();
            return res.status(500).send("Error en la ejecución de la consulta");
        }
        connection.close();
        res.json({ message: successMessage });
    });

    connection.execSql(request);
}

app.get('/carrito', (req, res) => {
    const connection = new Connection(config);

    connection.connect();

    connection.on('connect', (err) => {
        if (err) {
            console.log("Error al conectarse a la base de datos");
            return res.status(500).send("Error al conectarse a la base de datos");
        }
        executeCarritoQuery(connection, res);
    });
});

function executeCarritoQuery(connection, res) {
    const request = new Request("SELECT * FROM carrito", (err, rowCount) => {
        if (err) {
            connection.close();
            return res.status(500).send("Error en la ejecución de la consulta");
        }
    });

    const results = [];

    request.on('row', (columns) => {
        const result = {};
        columns.forEach(column => {
            result[column.metadata.colName] = column.value;
        });
        results.push(result);
    });

    request.on('requestCompleted', () => {
        res.json(results);
    });

    connection.execSql(request);
}

app.delete('/carrito/delete', (req, res) => {
    const connection = new Connection(config);

    connection.connect();

    connection.on('connect', (err) => {
        if (err) {
            console.log("Error al conectarse a la base de datos");
            return res.status(500).send("Error al conectarse a la base de datos");
        }
        
        const query = "DELETE FROM carrito";

        const request = new Request(query, (err, rowCount) => {
            if (err) {
                connection.close();
                return res.status(500).send("Error en la ejecución de la consulta");
            }

            connection.close();
            res.json({ message: "Registros de carrito eliminados exitosamente" });
        });

        connection.execSql(request);
    });
});

app.delete('/carrito/:id', (req, res) => {
    const { id } = req.params;
    const connection = new Connection(config);

    connection.connect();

    connection.on('connect', (err) => {
        if (err) {
            console.log("Error al conectarse a la base de datos");
            return res.status(500).send("Error al conectarse a la base de datos");
        }
        const query = `DELETE FROM carrito WHERE id_producto = ${id}`;
        executeQuery(connection, query, res);
    });
});

app.post('/compras', (req, res) => {
    const { direccion, telefono, tipoComprobante, metodoPago, total, carrito } = req.body;
    const connection = new Connection(config);

    connection.connect();

    connection.on('connect', (err) => {
        if (err) {
            console.log("Error al conectarse a la base de datos", err);
            return res.status(500).send("Error al conectarse a la base de datos");
        }

        const queryCompra = `
            INSERT INTO Compra (direccion, telefono, tipoComprobante, metodoPago, total, fecha) 
            OUTPUT INSERTED.id 
            VALUES (@direccion, @telefono, @tipoComprobante, @metodoPago, @total, GETDATE())
        `;

        const requestCompra = new Request(queryCompra, (err, rowCount, rows) => {
            if (err) {
                console.error("Error al insertar en la tabla Compra", err);
                connection.close();
                return res.status(500).send("Error al insertar en la tabla Compra");
            }

            if (rows && rows.length > 0 && rows[0].id) {
                const compraId = rows[0].id;

                // Verifica que carrito sea un arreglo con datos válidos
                if (Array.isArray(carrito) && carrito.length > 0) {
                    const insertValues = carrito.map(item => `(${compraId}, ${item.id_producto}, ${item.cantidad}, ${item.precio})`).join(', ');

                    const queryDetalleCompra = `
                        INSERT INTO DetalleCompra (id_compra, id_producto, cantidad, precio) 
                        VALUES ${insertValues}
                    `;

                    const requestDetalleCompra = new Request(queryDetalleCompra, (err, rowCount) => {
                        if (err) {
                            console.error("Error al insertar en la tabla DetalleCompra", err);
                            connection.close();
                            return res.status(500).send("Error al insertar en la tabla DetalleCompra");
                        }
                        connection.close();
                        res.json({ message: "Compra registrada exitosamente" });
                    });

                    connection.execSql(requestDetalleCompra);
                } else {
                    connection.close();
                    res.status(400).send("No se recibió un carrito válido");
                }
            } else {
                connection.close();
                res.status(500).send("No se pudo obtener el ID de la compra registrada");
            }
        });

        requestCompra.addParameter('direccion', TYPES.NVarChar, direccion);
        requestCompra.addParameter('telefono', TYPES.NVarChar, telefono);
        requestCompra.addParameter('tipoComprobante', TYPES.NVarChar, tipoComprobante);
        requestCompra.addParameter('metodoPago', TYPES.NVarChar, metodoPago);
        requestCompra.addParameter('total', TYPES.Decimal, total);

        requestCompra.on('row', (columns) => {
            // No es necesario hacer nada aquí, solo para activar el evento 'row'
        });

        connection.execSql(requestCompra);
    });
});
app.get('/compras', (req, res) => {
    const connection = new Connection(config);

    connection.connect();

    connection.on('connect', (err) => {
        if (err) {
            console.log("Error al conectarse a la base de datos");
            return res.status(500).send("Error al conectarse a la base de datos");
        }
        const query = "SELECT * FROM Compra";
        const request = new Request(query, (err, rowCount) => {
            if (err) {
                connection.close();
                return res.status(500).send("Error en la ejecución de la consulta");
            }
        });

        const results = [];

        request.on('row', (columns) => {
            const result = {};
            columns.forEach(column => {
                result[column.metadata.colName] = column.value;
            });
            results.push(result);
        });

        request.on('requestCompleted', () => {
            res.json(results);
        });

        connection.execSql(request);
    });
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
