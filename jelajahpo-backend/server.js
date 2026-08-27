const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 3001;
const saltRounds = 10;

const authJWT = require('./middleware');

app.use(cors());
app.use(express.json());
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'jelajahpo_db'
});

db.connect(err => {
    if (err) {
        console.error('Gagal konek ke database:', err)
    } else {
        console.log('Berhasil konek ke database JelajahPo');
    }
})

app.get('/', (req, res) => {
    res.send('Selamat datang di JelajahPo API!');
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM pengguna WHERE email = ?';

    db.query(sql, [email], (err, result) => {
        if (err) return res.status(500).json({ error: err.sqlMessage });
        if (result.length === 0) {
            return res.status(404).json({ message: 'Akun tidak ditemukan' });
        }

        const user = result[0];

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).json({ message: 'Password salah' });
        }

        const token = jwt.sign(
            { id: user.id_pengguna },
            'jelajahporahasia',
            { expiresIn: 86400 }
        );
        res.status(200).json({
            auth: true,
            token,
            id_pengguna: user.id_pengguna,
            nama: user.nama
        });
    });
});

app.get('/wisata/:id_wisata', (req, res) => {
    const { id_wisata } = req.params;
    const sql = 'SELECT * FROM wisata WHERE id_wisata = ?';
    db.query(sql, [id_wisata], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});


app.get('/wisata', (req, res) => {
    const sql = 'SELECT * FROM wisata';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

app.post('/pengguna', async (req, res) => {
    const { nama, email, password, no_hp } = req.body;

    if (!nama || !email || !password) {
        return res.status(400).json({ message: ' Nama, Email, dan Password wajib diisi' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const sql = 'INSERT INTO pengguna (nama, email, password, no_hp) VALUES (?,?,?,?)';
        db.query(sql, [nama, email, hashedPassword, no_hp], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ message: 'Email sudah terdaftar, gunakan email lain!' });
                }
                return res.status(400).json({ error: err.sqlMessage });
            }

            res.json({
                message: 'Akun berhasil dibuat!',
                id_pengguna: result.insertId
            });
        });
    } catch (err) {
        res.status(500).json({ error: 'Gagal mengenkripsi password' });
    }
});

app.listen(PORT, () => {
    console.log(`Server JelajahPo jalan di http://localhost:${PORT}`);
});

app.get('/kategori', (req, res) => {
    const sql = 'SELECT * FROM kategori';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

app.post('/wisata', (req, res) => {
    const { nama_wisata, deskripsi, harga_tiket, id_kategori } = req.body

    if (!nama_wisata || !harga_tiket || !deskripsi) {
        return res.status(400).json({ message: 'Nama wisata, deskripsi dan harga tiket wajib diisi' });
    }

    const sql = 'INSERT INTO wisata (nama_wisata, deskripsi, harga_tiket, id_kategori, tgl_input) VALUES (?, ?, ?, ?, NOW())';
    db.query(sql, [nama_wisata, deskripsi, harga_tiket, id_kategori], (err, result) => {
        if (err) return res.status(500).json({ error: err.sqlMessage });
        res.json({
            message: 'Wisata berhasil ditambahkan!',
            id_wisata: result.insertId
        });
    });
});

app.put('/wisata/:id_wisata', authJWT, (req, res) => {
    const { id_wisata } = req.params;
    const { nama_wisata, deskripsi, harga_tiket, id_kategori } = req.body;

    if (!nama_wisata || !harga_tiket) {
        return res.status(400).json({ message: 'Nama wisata dan harga tiket wajib diisi' });
    }

    const sql = 'UPDATE wisata SET nama_wisata=?, deskripsi=?, harga_tiket=?, id_kategori=? WHERE id_wisata=?';
    db.query(sql, [nama_wisata, deskripsi, harga_tiket, id_kategori, id_wisata], (err, result) => {
        if (err) return res.status(500).json({ error: err.sqlMessage });
        res.json({ message: 'Wisata berhasil diupdate!' });
    });
});

app.delete('/wisata/:id_wisata', authJWT, (req, res) => {
    const { id_wisata } = req.params;
    const sql = 'DELETE FROM wisata WHERE id_wisata = ?';
    db.query(sql, [id_wisata], (err, result) => {
        if (err) return res.status(500).json({ error: err.sqlMessage });
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Wisata tidak ditemukan' })
        }
        res.json({ message: 'Wisata berhasil dihapus!' });
    });
})