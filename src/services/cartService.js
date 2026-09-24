const { getProductoPorId, stockUp, stockDown, stockReload } = require('../models/products');

function ensureCart(session) {
    if (!session.carrito) {
        session.carrito = [];
    }

    return session.carrito;
}

function validateProduct(productId) {
    const id = Number(productId);
    if (!Number.isInteger(id) || id <= 0) {
        return null;
    }

    const product = getProductoPorId(id);
    return product || null;
}

function getProductPrice(productId) {
    const product = validateProduct(productId);
    return product ? Number(product.price) : null;
}

function calculateTotals(session) {
    const carrito = ensureCart(session);
    let total = 0;

    for (const item of carrito) {
        const product = validateProduct(item.productId);
        if (product) {
            const cantidad = Number(item.quantity || 0);
            const precio = Number(product.price || 0);
            total += cantidad * precio;
        }
    }

    return total;
}

function getCartDetails(session) {
    const carrito = ensureCart(session);

    const elementosCarrito = carrito
        .map(item => {
            const objeto = validateProduct(item.productId);

            if (!objeto) {
                return null;
            }

            const cantidad = Number(item.quantity || 0);
            const precio = Number(objeto.price || 0);
            const total = cantidad * precio;

            return {
                cantidad,
                objeto,
                total
            };
        })
        .filter(Boolean);

    const totalCarrito = elementosCarrito.reduce((sum, item) => sum + item.total, 0);

    return {
        elementosCarrito,
        totalCarrito
    };
}

function addProduct(session, productId, productName) {
    const product = validateProduct(productId);

    if (!product) {
        return {
            success: false,
            error: true,
            message: 'Producto no encontrado',
            carrito: ensureCart(session)
        };
    }

    const name = productName || product.name;
    const carrito = ensureCart(session);
    const item = carrito.find(p => p.productId === product.id);

    if (item) {
        item.quantity += 1;
        return {
            success: true,
            carrito,
            message: `${name} ya estaba en el carrito, se sumó otra unidad`
        };
    }

    carrito.push({ productId: product.id, quantity: 1 });
    return {
        success: true,
        carrito,
        message: `${name} se agregó al carrito`
    };
}

function incrementQuantity(session, productId) {
    const product = validateProduct(productId);
    if (!product) {
        return ensureCart(session);
    }

    const carrito = ensureCart(session);
    const item = carrito.find(p => p.productId === product.id);

    if (item) {
        item.quantity += 1;
    }

    stockDown(product.id);

    return carrito;
}

function decrementQuantity(session, productId) {
    const id = Number(productId);
    const carrito = ensureCart(session);

    session.carrito = carrito
        .map(item => {
            if (item.productId === id) {
                return {
                    ...item,
                    quantity: Math.max(0, Number(item.quantity) - 1)
                };
            }

            return item;
        })
        .filter(item => item.quantity > 0);

    stockUp(id);

    return session.carrito;
}

function removeProduct(session, productId) {
    const id = Number(productId);
    const carrito = ensureCart(session);
    const item = carrito.find(p => p.productId === id);

    if (item) {
        stockReload(item.productId, item.quantity);
    }

    session.carrito = carrito.filter(item => item.productId !== id);
    return session.carrito;
}

function getCart(session) {
    return ensureCart(session);
}

module.exports = {
    ensureCart,
    validateProduct,
    getProductPrice,
    calculateTotals,
    getCartDetails,
    addProduct,
    incrementQuantity,
    decrementQuantity,
    removeProduct,
    getCart,
};
