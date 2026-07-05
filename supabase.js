/* Supabase JavaScript Client - Version CDN / UMD Lite */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.supabase = {}));
})(this, (function (exports) { 'use strict';
    // Módulo de inicialización del cliente web independiente
    exports.createClient = function (supabaseUrl, supabaseKey, options) {
        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Supabase URL y Anon Key son requeridas de forma obligatoria.');
        }
        const authUrl = `${supabaseUrl}/auth/v1`;
        const headers = {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json'
        };
        return {
            auth: {
                signInWithPassword: async function (credentials) {
                    try {
                        const response = await fetch(`${authUrl}/token?grant_type=password`, {
                            method: 'POST',
                            headers: headers,
                            body: JSON.stringify({
                                email: credentials.email,
                                password: credentials.password
                            })
                        });
                        const resData = await response.json();
                        if (!response.ok) {
                            return { data: null, error: { message: resData.error_description || resData.msg || 'Credenciales incorrectas' } };
                        }
                        return { data: resData, error: null };
                    } catch (err) {
                        return { data: null, error: { message: 'Fallo de conexión de red con Supabase.' } };
                    }
                },
                signOut: async function () {
                    try {
                        await fetch(`${authUrl}/logout`, { method: 'POST', headers: headers });
                        return { error: null };
                    } catch (err) {
                        return { error: err };
                    }
                }
            }
        };
    };
    Object.defineProperty(exports, '__esModule', { value: true });
}));
