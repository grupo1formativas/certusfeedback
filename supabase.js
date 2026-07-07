/* Supabase JavaScript Client - Versión Local Completa con Base de Datos */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.supabase = {}));
})(this, (function (exports) { 'use strict';
    exports.createClient = function (supabaseUrl, supabaseKey) {
        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Supabase URL y Anon Key son requeridas.');
        }
        const authUrl = `${supabaseUrl}/auth/v1`;
        const restUrl = `${supabaseUrl}/rest/v1`;
        const headers = {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        };
        return {
            auth: {
                getSession: async function () {
                    const session = localStorage.getItem('sb-session');
                    return { data: { session: session ? JSON.parse(session) : null }, error: null };
                },
                signInWithPassword: async function (credentials) {
                    try {
                        const response = await fetch(`${authUrl}/token?grant_type=password`, {
                            method: 'POST',
                            headers: headers,
                            body: JSON.stringify({ email: credentials.email, password: credentials.password })
                        });
                        const resData = await response.json();
                        if (!response.ok) return { data: null, error: { message: resData.error_description || 'Error de credenciales' } };
                        localStorage.setItem('sb-session', JSON.stringify(resData));
                        return { data: resData, error: null };
                    } catch (err) {
                        return { data: null, error: err };
                    }
                },
                signOut: async function () {
                    localStorage.removeItem('sb-session');
                    return { error: null };
                }
            },
            from: function (tableName) {
                return {
                    select: function () {
                        return {
                            order: function (column, { ascending }) {
                                return new Promise(async (resolve) => {
                                    try {
                                        const response = await fetch(`${restUrl}/${tableName}?select=*&order=${column}.${ascending ? 'asc' : 'desc'}`, { method: 'GET', headers: headers });
                                        const data = await response.json();
                                        resolve({ data, error: response.ok ? null : data });
                                    } catch (err) { resolve({ data: null, error: err }); }
                                });
                            }
                        };
                    },
                    update: function (values) {
                        return {
                            eq: function (column, value) {
                                return {
                                    select: function () {
                                        return new Promise(async (resolve) => {
                                            try {
                                                const response = await fetch(`${restUrl}/${tableName}?${column}=eq.${value}`, {
                                                    method: 'PATCH',
                                                    headers: headers,
                                                    body: JSON.stringify(values)
                                                });
                                                const data = await response.json();
                                                resolve({ data, error: response.ok ? null : data });
                                            } catch (err) { resolve({ data: null, error: err }); }
                                        });
                                    }
                                };
                            }
                        };
                    },
                    insert: function (values) {
                        return {
                            select: function () {
                                return new Promise(async (resolve) => {
                                    try {
                                        const response = await fetch(`${restUrl}/${tableName}`, {
                                            method: 'POST',
                                            headers: headers,
                                            body: JSON.stringify(values)
                                        });
                                        let data = null;
                                        if (response.status !== 204) {
                                            data = await response.json();
                                        }
                                        resolve({ data, error: response.ok ? null : { message: "Error al insertar" } });
                                    } catch (err) { resolve({ data: null, error: err }); }
                                });
                            }
                        };
                    }
                };
            }
        }; // <-- CORREGIDO: Cierre del objeto que retorna createClient
    }; // <-- CORREGIDO: Cierre de la función createClient
    Object.defineProperty(exports, '__esModule', { value: true });
}));

