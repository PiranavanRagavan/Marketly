import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, AlertTriangle, Edit2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { products as initialProducts, Product } from '@/data/products';

const Inventory: React.FC = () => {
  const navigate = useNavigate();
  const { isManager, isStaff, loading } = useAuth();
  const { toast } = useToast();
  
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    category: true,
    name: true,
    stock: true,
    price: true,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ stock: number; price: number }>({ stock: 0, price: 0 });

  // Redirect if not staff or manager
  useEffect(() => {
    if (!loading && !isManager && !isStaff) {
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to view this page',
        variant: 'destructive',
      });
      navigate('/');
    }
  }, [isManager, isStaff, loading, navigate, toast]);

  // Filter and sort products
  useEffect(() => {
    let result = [...products];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply stock filter
    if (stockFilter === 'low') {
      result = result.filter((p) => p.stock < 20 && p.stock > 0);
    } else if (stockFilter === 'out') {
      result = result.filter((p) => p.stock === 0);
    } else if (stockFilter === 'in') {
      result = result.filter((p) => p.stock >= 20);
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'id') {
        return a.id.localeCompare(b.id);
      } else if (sortBy === 'stock') {
        return a.stock - b.stock;
      } else if (sortBy === 'price') {
        return a.price - b.price;
      }
      return 0;
    });

    setFilteredProducts(result);
  }, [products, searchTerm, stockFilter, sortBy]);

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setEditValues({ stock: product.stock, price: product.price });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({ stock: 0, price: 0 });
  };

  const saveEdit = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, stock: editValues.stock, price: editValues.price }
          : p
      )
    );

    toast({
      title: 'Success',
      description: 'Product updated successfully',
    });

    setEditingId(null);
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </main>
    );
  }

  if (!isManager && !isStaff) {
    return null;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Package className="h-8 w-8" />
            Inventory Management
          </h1>
          <p className="text-muted-foreground mt-1">
            {isManager ? 'Manage and monitor your product inventory' : 'View product inventory'}
          </p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters & Controls</CardTitle>
          <CardDescription>Customize your inventory view</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock-filter">Stock Status</Label>
              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger id="stock-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="in">In Stock (≥ 20)</SelectItem>
                  <SelectItem value="low">Low Stock (&lt; 20)</SelectItem>
                  <SelectItem value="out">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sort-by">Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger id="sort-by">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="id">Product ID</SelectItem>
                  <SelectItem value="stock">Stock Level</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Visible Columns</Label>
            <div className="flex flex-wrap gap-4">
              {Object.entries(visibleColumns).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={value}
                    onCheckedChange={(checked) =>
                      setVisibleColumns((prev) => ({ ...prev, [key]: checked as boolean }))
                    }
                  />
                  <Label htmlFor={key} className="capitalize cursor-pointer">
                    {key}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {visibleColumns.id && <TableHead>Product ID</TableHead>}
                  {visibleColumns.category && <TableHead>Category</TableHead>}
                  {visibleColumns.name && <TableHead>Name</TableHead>}
                  {visibleColumns.stock && <TableHead>Stock</TableHead>}
                  {visibleColumns.price && <TableHead>Price</TableHead>}
                  {isManager && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isManager ? 6 : 5} className="text-center py-8 text-muted-foreground">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => {
                    const isEditing = editingId === product.id;
                    return (
                      <TableRow
                        key={product.id}
                        className={product.stock < 20 ? 'bg-warning/10' : ''}
                      >
                        {visibleColumns.id && (
                          <TableCell className="font-mono text-sm">{product.id}</TableCell>
                        )}
                        {visibleColumns.category && (
                          <TableCell>
                            <Badge variant="secondary">{product.category}</Badge>
                          </TableCell>
                        )}
                        {visibleColumns.name && <TableCell>{product.name}</TableCell>}
                        {visibleColumns.stock && (
                          <TableCell>
                            {isEditing ? (
                              <Input
                                type="number"
                                value={editValues.stock}
                                onChange={(e) =>
                                  setEditValues((prev) => ({
                                    ...prev,
                                    stock: parseInt(e.target.value) || 0,
                                  }))
                                }
                                className="w-24"
                              />
                            ) : (
                              <div className="flex items-center gap-2">
                                {product.stock < 20 && (
                                  <AlertTriangle className="h-4 w-4 text-warning" />
                                )}
                                <span
                                  className={
                                    product.stock === 0
                                      ? 'text-destructive font-semibold'
                                      : product.stock < 20
                                      ? 'text-warning font-semibold'
                                      : ''
                                  }
                                >
                                  {product.stock}
                                </span>
                              </div>
                            )}
                          </TableCell>
                        )}
                        {visibleColumns.price && (
                          <TableCell>
                            {isEditing ? (
                              <Input
                                type="number"
                                step="0.01"
                                value={editValues.price}
                                onChange={(e) =>
                                  setEditValues((prev) => ({
                                    ...prev,
                                    price: parseFloat(e.target.value) || 0,
                                  }))
                                }
                                className="w-28"
                              />
                            ) : (
                              `$${product.price.toFixed(2)}`
                            )}
                          </TableCell>
                        )}
                        {isManager && (
                          <TableCell className="text-right">
                            {isEditing ? (
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => saveEdit(product.id)}
                                >
                                  <Save className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={cancelEdit}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => startEdit(product)}
                              >
                                <Edit2 className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 text-sm text-muted-foreground">
        Showing {filteredProducts.length} of {products.length} products
      </div>
    </main>
  );
};

export default Inventory;
