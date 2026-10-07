const autorizar = (...papeisPermitidos) => {
    return (req, res, next) => {
        if (!req.usuarioPapel) {
            return res.status(401).json({ sucesso: false, mensagem: "Usuário não autenticado" });
        }
        
        if (papeisPermitidos.length > 0 && !papeisPermitidos.includes(req.usuarioPapel)) {
            return res.status(403).json({ 
                sucesso: false, 
                mensagem: "Acesso negado. Apenas administradores podem realizar esta ação." 
            });
        }
        
        return next();
    };
};

module.exports = autorizar;
