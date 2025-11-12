CREATE DATABASE mpcm;

USE mpcm;

CREATE TABLE usuario(
id_usuario INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(75),
senha VARCHAR(75),
email VARCHAR(100)
);

CREATE TABLE peca(
id_peca INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
tipo ENUM('Processador', 'Placa de Vídeo', 'Placa Mãe', 'Memória RAM', 'Armazenamento', 'Fonte') NOT NULL,
modelo VARCHAR(155) NOT NULL,
specs TEXT,
preco DECIMAL(8,2),
watts_consumidos DECIMAL(8,1) NOT NULL,
link VARCHAR(100),
link_imagem VARCHAR(100)
);

CREATE TABLE computador(
id_computador INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
potencia_necessaria DECIMAL(8,1),
preco_estimado DECIMAL(8,2),
usuario_id INT,
peca_id INT,
FOREIGN KEY(usuario_id)
REFERENCES usuario(id_usuario),
FOREIGN KEY(peca_id)
REFERENCES peca(id_peca)
);

CREATE TABLE computador_has_peca(
peca_id INT,
computador_id INT,
PRIMARY KEY (peca_id, computador_id),
FOREIGN KEY (peca_id) REFERENCES peca(id_peca),
FOREIGN KEY (computador_id) REFERENCES computador(id_computador)
);

CREATE TABLE post(
id_post INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
titulo VARCHAR(75),
descricao TEXT,
avaliacao INT (2),
CHECK (avaliacao <= 10 AND avaliacao >= 0),
usuario_id INT,
computador_id INT,
FOREIGN KEY(usuario_id)
REFERENCES usuario(id_usuario),
FOREIGN KEY(computador_id)
REFERENCES computador(id_computador)
);

CREATE TABLE comentario(
id_comentario INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
comentario VARCHAR(155),
post_id INT,
usuario_id INT,
FOREIGN KEY(post_id) 
REFERENCES post(id_post),
FOREIGN KEY(usuario_id)
REFERENCES usuario(id_usuario)
);

SELECT * FROM usuario;
