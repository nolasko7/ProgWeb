function ensureCart(session) {
    if (!session.carrito) {
        session.carrito = [];
    }

    return session.carrito;
}

function addProduct(session, productId, productName) {
    const carrito = ensureCart(session);
    const item = carrito.find(producto => producto.productId === productId);

    if (item) {
        item.quantity += 1;
        return {
            carrito,
            message: `${productName} ya estaba en el carrito, se sumó otra unidad`
        };
    }

    carrito.push({ productId, quantity: 1 });
    return {
        carrito,
        message: `${productName} se agregó al carrito`
    };
}

function incrementQuantity(session, productId) {
    const carrito = ensureCart(session);
    const item = carrito.find(producto => producto.productId === productId);

    if (item) {
        item.quantity += 1;
    }

    return carrito;
}

function decrementQuantity(session, productId) {
    const carrito = ensureCart(session);

    session.carrito = carrito
        .map(item => {
            if (item.productId === productId) {
                return {
                    ...item,
                    quantity: Math.max(0, Number(item.quantity) - 1)
                };
            }

            return item;
        })
        .filter(item => item.quantity > 0);

    return session.carrito;
}

function removeProduct(session, productId) {
    const carrito = ensureCart(session);
    session.carrito = carrito.filter(item => item.productId !== productId);
    return session.carrito;
}

function getCart(session) {
    return ensureCart(session);
}

module.exports = {
    ensureCart,
    addProduct,
    incrementQuantity,
    decrementQuantity,
    removeProduct,
    getCart,
};
