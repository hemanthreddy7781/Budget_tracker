import type { Request, Response, NextFunction } from 'express';
import pool from '../db/connection.js';
export const getSettings = async (req:Request,res:Response,next:NextFunction):Promise<void> => {
 try { const [rows]=await pool.query('SELECT week_start,currency_country,currency_code,currency_symbol,unit_position FROM settings WHERE user_id=?',[req.user!.id]); res.json((rows as unknown[])[0] ?? null); } catch(e){next(e);}
};
export const updateSettings = async (req:Request,res:Response,next:NextFunction):Promise<void> => {
 try {
  const keys=['week_start','currency_country','currency_code','currency_symbol','unit_position'] as const;
  const fields:string[]=[]; const vals:unknown[]=[];
  for(const k of keys) if(req.body[k]!==undefined){fields.push(`${k}=?`);vals.push(req.body[k]);}
  if(fields.length) await pool.query(`UPDATE settings SET ${fields.join(',')} WHERE user_id=?`,[...vals,req.user!.id]);
  const [rows]=await pool.query('SELECT week_start,currency_country,currency_code,currency_symbol,unit_position FROM settings WHERE user_id=?',[req.user!.id]);res.json((rows as unknown[])[0]);
 }catch(e){next(e);}
};
