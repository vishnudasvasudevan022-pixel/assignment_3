import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Box,
  IconButton,
  InputAdornment,
  Chip,
  Avatar,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import { Brightness4, Brightness7, Search, PersonAdd, Dashboard as DashboardIcon, Person, LocationOn, Work, AttachMoney } from '@mui/icons-material';
import axios from 'axios';

// Glassmorphic helper styles generator based on mode
const getGlassStyle = (mode) => ({
  background: mode === 'dark' 
    ? 'rgba(18, 24, 38, 0.65)' 
    : 'rgba(255, 255, 255, 0.55)',
  backdropFilter: 'blur(16px) saturate(180%)',
  WebkitBackdropFilter: 'blur(16px) saturate(180%)',
  border: mode === 'dark' 
    ? '1px solid rgba(255, 255, 255, 0.125)' 
    : '1px solid rgba(209, 213, 219, 0.4)',
  boxShadow: mode === 'dark'
    ? '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
    : '0 8px 32px 0 rgba(31, 38, 135, 0.12)',
  borderRadius: '20px',
});

// Custom Theme with Premium Google Fonts
const getCustomTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: mode === 'dark' ? '#818cf8' : '#4f46e5',
    },
    secondary: {
      main: mode === 'dark' ? '#f472b6' : '#ec4899',
    },
    background: {
      default: mode === 'dark' ? '#0f172a' : '#f1f5f9',
      paper: mode === 'dark' ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h4: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    subtitle1: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      borderRadius: '12px',
    },
  },
});

// Navbar Component
function Navbar({ mode, toggleMode }) {
  const location = useLocation();

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        ...getGlassStyle(mode),
        borderRadius: '0 0 20px 20px',
        mb: 4,
        px: 2
      }}
    >
      <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 40,
            height: 40,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
          }}>
            EP
          </Box>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 800,
              background: mode === 'dark' 
                ? 'linear-gradient(90deg, #ffffff, #cbd5e1)' 
                : 'linear-gradient(90deg, #0f172a, #334155)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            EmployeePortal
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button 
            component={Link} 
            to="/" 
            startIcon={<DashboardIcon />}
            variant={location.pathname === '/' ? 'contained' : 'text'}
            sx={{
              px: 2.5,
              py: 1,
              background: location.pathname === '/' 
                ? 'linear-gradient(135deg, #6366f1, #4f46e5)' 
                : 'transparent',
              color: location.pathname === '/' ? '#fff' : 'inherit'
            }}
          >
            Dashboard
          </Button>
          <Button 
            component={Link} 
            to="/add" 
            startIcon={<PersonAdd />}
            variant={location.pathname === '/add' ? 'contained' : 'text'}
            sx={{
              px: 2.5,
              py: 1,
              background: location.pathname === '/add' 
                ? 'linear-gradient(135deg, #6366f1, #4f46e5)' 
                : 'transparent',
              color: location.pathname === '/add' ? '#fff' : 'inherit'
            }}
          >
            Add Employee
          </Button>
          <IconButton 
            onClick={toggleMode} 
            sx={{ 
              ml: 1, 
              ...getGlassStyle(mode),
              p: 1.2,
              '&:hover': { transform: 'scale(1.05)' } 
            }}
            color="inherit"
          >
            {mode === 'dark' ? <Brightness7 sx={{ color: '#fbbf24' }} /> : <Brightness4 sx={{ color: '#6366f1' }} />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

// Home / Dashboard Component
function Dashboard({ mode, employees, setEmployees }) {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only fetch initial dummy data if the list is empty
    if (employees.length === 0) {
      setLoading(true);
      axios.get('https://jsonplaceholder.typicode.com/users')
        .then((res) => {
          setEmployees(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching data:', err);
          setLoading(false);
        });
    }
  }, [employees, setEmployees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => 
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [employees, search]);

  return (
    <Container maxWidth="lg" sx={{ pb: 6 }}>
      {/* Header & Search */}
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', md: 'center' }, gap: 2 }}>
        <Box>
          <Typography 
            variant="h4" 
            sx={{ 
              background: 'linear-gradient(90deg, #6366f1, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 0.5
            }}
          >
            Employee Directory
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and view active team members synced from API.
          </Typography>
        </Box>

        <TextField
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            minWidth: { xs: '100%', md: 320 },
            '& .MuiOutlinedInput-root': {
              ...getGlassStyle(mode),
              borderRadius: '16px',
              paddingLeft: '8px'
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Stats Quick View */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ ...getGlassStyle(mode) }}>
            <CardContent>
              <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: '0.1em' }}>
                Total Employees
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, mt: 1, color: '#6366f1' }}>
                {employees.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ ...getGlassStyle(mode) }}>
            <CardContent>
              <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: '0.1em' }}>
                Search Results
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, mt: 1, color: '#a855f7' }}>
                {filteredEmployees.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ ...getGlassStyle(mode) }}>
            <CardContent>
              <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: '0.1em' }}>
                API Status
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5 }}>
                <Chip label="Connected" color="success" size="small" sx={{ fontWeight: 700, borderRadius: '8px' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Table Section */}
      <TableContainer component={Paper} sx={{ ...getGlassStyle(mode), overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)' }}>
              <TableCell sx={{ fontWeight: 700, py: 2 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700, py: 2 }}>Employee</TableCell>
              <TableCell sx={{ fontWeight: 700, py: 2 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 700, py: 2 }}>City</TableCell>
              <TableCell sx={{ fontWeight: 700, py: 2 }}>Company</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                  <Typography variant="body1" color="text.secondary">Loading workforce data...</Typography>
                </TableCell>
              </TableRow>
            ) : filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                  <Typography variant="body1" color="text.secondary">No matching employees found.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployees.map((emp) => (
                <TableRow 
                  key={emp.id}
                  sx={{ 
                    '&:hover': { 
                      background: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(99, 102, 241, 0.04)',
                      transition: '0.2s smooth'
                    } 
                  }}
                >
                  <TableCell sx={{ fontWeight: 700, color: '#6366f1' }}>#{emp.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ bgcolor: '#6366f1', width: 34, height: 34, fontSize: '0.875rem', fontWeight: 700 }}>
                        {emp.name.charAt(0)}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{emp.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{emp.email}</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{emp.address?.city || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={emp.company?.name || 'Active'} 
                      size="small" 
                      variant="outlined" 
                      sx={{ borderRadius: '8px', fontWeight: 500 }} 
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

// Employee Form Component
function EmployeeForm({ mode, employees, setEmployees }) {
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    location: '',
    salary: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create new employee object with unique ID
    const newEmployee = {
      id: employees.length + 1,
      name: formData.name,
      email: `${formData.name.toLowerCase().replace(/\s+/g, '')}@company.com`,
      address: { city: formData.location },
      company: { name: formData.designation }
    };

    // Add new employee to state array
    setEmployees([...employees, newEmployee]);

    alert(`Employee "${formData.name}" added successfully!`);
    setFormData({ name: '', designation: '', location: '', salary: '' });
  };

  return (
    <Container maxWidth="sm" sx={{ pb: 6 }}>
      <Paper sx={{ ...getGlassStyle(mode), p: 4 }}>
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography 
            variant="h4" 
            sx={{ 
              background: 'linear-gradient(90deg, #6366f1, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1 
            }}
          >
            Add New Employee
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Fill out the details below to register a new team member.
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField 
            label="Full Name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            fullWidth 
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
          />

          <TextField 
            label="Designation" 
            name="designation" 
            value={formData.designation} 
            onChange={handleChange} 
            required 
            fullWidth 
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Work color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
          />

          <TextField 
            label="Location" 
            name="location" 
            value={formData.location} 
            onChange={handleChange} 
            required 
            fullWidth 
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOn color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
          />

          <TextField 
            label="Salary ($)" 
            name="salary" 
            type="number" 
            value={formData.salary} 
            onChange={handleChange} 
            required 
            fullWidth 
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AttachMoney color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
          />

          <Button 
            type="submit" 
            variant="contained" 
            size="large"
            sx={{ 
              mt: 1,
              py: 1.5,
              fontSize: '1rem',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.35)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5, #4338ca)',
              }
            }}
          >
            Submit Employee Profile
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

// Main App Wrapper
export default function App() {
  const [mode, setMode] = useState('dark');
  const [employees, setEmployees] = useState([]);

  const theme = useMemo(() => getCustomTheme(mode), [mode]);

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box 
        sx={{ 
          minHeight: '100vh',
          background: mode === 'dark' 
            ? 'radial-gradient(circle at 15% 15%, #1e1b4b 0%, #0f172a 50%, #020617 100%)' 
            : 'radial-gradient(circle at 15% 15%, #e0e7ff 0%, #f1f5f9 50%, #e2e8f0 100%)',
          transition: 'background 0.3s ease-in-out'
        }}
      >
        <Router>
          <Navbar mode={mode} toggleMode={toggleMode} />
          <Routes>
            <Route path="/" element={<Dashboard mode={mode} employees={employees} setEmployees={setEmployees} />} />
            <Route path="/add" element={<EmployeeForm mode={mode} employees={employees} setEmployees={setEmployees} />} />
          </Routes>
        </Router>
      </Box>
    </ThemeProvider>
  );
}