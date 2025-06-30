import React, { useEffect, useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Container,
    Grid,
    Card,
    CardContent,
    CardMedia,
    CardActions,
    Button,
    Snackbar,
    Alert,
    CircularProgress,
    IconButton,
    Badge,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    Paper,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

function App() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    useEffect(() => {
        loadProducts();
        loadCart();
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/products`);
            setProducts(response.data);
        } catch (e) {
            showSnackbar("Erro ao carregar produtos.", "error");
        }
        setLoading(false);
    };

    const loadCart = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/cart`);
            setCart(response.data);
        } catch (e) {
            console.error(e);
        }
    };

    const addToCart = async (productId) => {
        try {
            await axios.post(`${API_BASE_URL}/api/cart/add/${productId}/1`);
            await loadCart();
            showSnackbar("Produto adicionado ao carrinho!", "success");
        } catch (e) {
            showSnackbar("Erro ao adicionar produto.", "error");
        }
    };

    const checkout = async () => {
        try {
            await axios.post(`${API_BASE_URL}/api/cart/checkout`);
            await loadCart();
            showSnackbar("Compra finalizada com sucesso!", "success");
        } catch (e) {
            showSnackbar("Erro ao finalizar compra.", "error");
        }
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    return (
        <div>
            <AppBar position="static" color="primary">
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        E-commerce Demo
                    </Typography>
                    <IconButton color="inherit">
                        <Badge badgeContent={cart?.items?.length || 0} color="secondary">
                            <ShoppingCartIcon />
                        </Badge>
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Container sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Produtos
                </Typography>

                {loading ? (
                    <CircularProgress />
                ) : (
                    <Grid container spacing={4}>
                        {products.map((product) => (
                            <Grid item xs={12} sm={6} md={4} key={product.id}>
                                <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={`https://source.unsplash.com/400x300/?product,${product.name}`}
                                        alt={product.name}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h6" component="div">
                                            {product.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {product.description}
                                        </Typography>
                                        <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                                            R$ {Number(product.price).toFixed(2)}
                                        </Typography>
                                    </CardContent>
                                    <CardActions sx={{ mt: "auto" }}>
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            onClick={() => addToCart(product.id)}
                                        >
                                            Adicionar ao Carrinho
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                <Typography variant="h4" gutterBottom sx={{ mt: 6 }}>
                    Carrinho
                </Typography>

                {cart && cart.items?.length > 0 ? (
                    <>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Produto</TableCell>
                                        <TableCell>Qtd</TableCell>
                                        <TableCell>Preço Unitário</TableCell>
                                        <TableCell>Subtotal</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {cart.items.map((item) => (
                                        <TableRow key={item.productId}>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>R$ {Number(item.price).toFixed(2)}</TableCell>
                                            <TableCell>R$ {Number(item.total).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Typography variant="h6" sx={{ mt: 2 }}>
                            Total: R$ {Number(cart.total).toFixed(2)}
                        </Typography>

                        <Button
                            variant="contained"
                            color="success"
                            sx={{ mt: 2 }}
                            onClick={checkout}
                        >
                            Finalizar Compra
                        </Button>
                    </>
                ) : (
                    <Typography>Seu carrinho está vazio.</Typography>
                )}

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                >
                    <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
        </div>
    );
}

export default App;
