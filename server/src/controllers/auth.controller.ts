import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db/connection.js';

const defaults = [
  ['Salary','income','briefcase'],['Freelance','income','laptop'],['Investment','income','trending-up'],
  ['Gift','income','gift'],['Refund','income','rotate-ccw'],['Food & Dining','expense','utensils'],
  ['Transport','expense','car'],['Shopping','expense','shopping-bag'],['Groceries','expense','shopping-cart'],
  ['Bills','expense','receipt'],['Entertainment','expense','clapperboard'],['Health','expense','heart-pulse'],
] as const;
const groups = [['Cash',0],['Bank',1],['Card',2],['E-wallet',3]] as const;

function tokenFor(id: number, email: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) throw new Error('JWT_SECRET must be at least 32 characters');
  return jwt.sign({ email }, secret, { subject: String(id), expiresIn: '7d' });
}

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  const conn = await pool.getConnection();
  try {
    const name = String(req.body.name).trim();
    const email = String(req.body.email).trim().toLowerCase();
    const password = String(req.body.password);
    await conn.beginTransaction();
    const [existing] = await conn.query('SELECT id FROM users WHERE email = ?', [email]);
    if ((existing as unknown[]).length) {
      await conn.rollback(); res.status(409).json({ error: 'An account with this email already exists' }); return;
    }
    const hash = await bcrypt.hash(password, 12);
    const [created] = await conn.query('INSERT INTO users (name,email,password_hash) VALUES (?,?,?)', [name,email,hash]);
    const userId = (created as any).insertId;
    await conn.query("INSERT INTO settings (user_id) VALUES (?)", [userId]);
    for (const [categoryName,type,icon] of defaults) {
      await conn.query('INSERT INTO categories (user_id,name,type,icon) VALUES (?,?,?,?)', [userId,categoryName,type,icon]);
    }
    let cashGroupId: number | null = null;
    for (const [groupName,sort] of groups) {
      const [groupResult] = await conn.query('INSERT INTO account_groups (user_id,name,sort_order) VALUES (?,?,?)', [userId,groupName,sort]);
      if (groupName === 'Cash') cashGroupId = (groupResult as any).insertId;
    }
    await conn.query(
      "INSERT INTO accounts (user_id,name,type,icon,color,balance,group_id) VALUES (?,?,?,?,?,?,?)",
      [userId,'Cash','Wallet','banknote','#22c55e',0,cashGroupId],
    );
    await conn.commit();
    res.status(201).json({ token: tokenFor(userId,email), user: { id: userId, name, email } });
  } catch (err) { await conn.rollback(); next(err); }
  finally { conn.release(); }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const email = String(req.body.email).trim().toLowerCase();
    const [rows] = await pool.query('SELECT id,name,email,password_hash FROM users WHERE email=? LIMIT 1',[email]);
    const user = (rows as {id:number;name:string;email:string;password_hash:string}[])[0];
    if (!user || !(await bcrypt.compare(String(req.body.password), user.password_hash))) {
      res.status(401).json({ error: 'Invalid email or password' }); return;
    }
    res.json({ token: tokenFor(user.id,user.email), user: { id:user.id,name:user.name,email:user.email } });
  } catch (err) { next(err); }
}

export async function me(req: Request, res: Response): Promise<void> {
  const [rows] = await pool.query('SELECT id,name,email FROM users WHERE id=?',[req.user!.id]);
  const user = (rows as {id:number;name:string;email:string}[])[0];
  if (!user) { res.status(401).json({ error:'User no longer exists' }); return; }
  res.json({ user });
}
