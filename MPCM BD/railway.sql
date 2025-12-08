USE railway;

CREATE TABLE usuario(
id_usuario INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(75) NOT NULL,
senha VARCHAR(75) NOT NULL,
email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE peca(
id_peca INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
tipo ENUM('Processador', 'Placa de Vídeo', 'Placa Mãe', 'Memória RAM', 'Armazenamento', 'Fonte') NOT NULL,
modelo VARCHAR(155) NOT NULL,
specs TEXT DEFAULT('Nenhuma spec foi encontrada no banco'),
preco DECIMAL(8,2) DEFAULT('Não há preços encontrados para este produto'),
watts_consumidos DECIMAL(8,1) NOT NULL,
link VARCHAR(100),
link_imagem VARCHAR(100)
);

CREATE TABLE computador(
id_computador INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
potencia_necessaria DECIMAL(8,1),
preco_estimado DECIMAL(8,2),
usuario_id INT NOT NULL,
peca_id INT NOT NULL,
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
titulo VARCHAR(75) NOT NULL,
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

INSERT INTO peca(tipo, modelo, preco, watts_consumidos) VALUES
('Fonte', 'Fonte teste', 100, 100)
;

SELECT * FROM usuario;

SELECT count(id_computador) AS numero_builds FROM computador
JOIN usuario
ON usuario_id = usuario.id_usuario
WHERE usuario_id = 66;

ALTER TABLE peca
ADD COLUMN qntd INT(3);

INSERT INTO peca(tipo, modelo, specs, preco, watts_consumidos, link) VALUES
('Processador', 'Intel Core i7-14700K', '20 Cores, 28 Threads, Max Turbo 5.5 GHz', 4500.00, 125.0, 'link_i7-14700k'),
('Processador', 'AMD Ryzen 7 7700X', '8 Cores, 16 Threads, Max Boost 5.4 GHz', 2800.00, 105.0, 'link_r7-7700x'),
('Processador', 'Intel Core i5-13400F', '10 Cores, 16 Threads, Max Turbo 4.6 GHz', 1400.00, 65.0, 'link_i5-13400f'),
('Processador', 'AMD Ryzen 5 5600', '6 Cores, 12 Threads, Max Boost 4.4 GHz', 850.00, 65.0, 'link_r5-5600'),
('Processador', 'Intel Core i9-14900K', '24 Cores, 32 Threads, Max Turbo 6.0 GHz', 6500.00, 150.0, 'link_i9-14900k');

INSERT INTO peca(tipo, modelo, specs, preco, watts_consumidos, link) VALUES
('Placa de Vídeo', 'NVIDIA GeForce RTX 4090', '24GB GDDR6X, Ada Lovelace, DLSS 3', 15000.00, 450.0, 'link_rtx-4090'),
('Placa de Vídeo', 'AMD Radeon RX 7900 XT', '20GB GDDR6, RDNA 3', 6800.00, 300.0, 'link_rx-7900xt'),
('Placa de Vídeo', 'NVIDIA GeForce RTX 4060 Ti', '8GB GDDR6, DLSS 3', 2500.00, 165.0, 'link_rtx-4060ti'),
('Placa de Vídeo', 'AMD Radeon RX 6600', '8GB GDDR6, RDNA 2', 1200.00, 132.0, 'link_rx-6600'),
('Placa de Vídeo', 'NVIDIA GeForce GTX 1650', '4GB GDDR5, Turing', 800.00, 75.0, 'link_gtx-1650');

INSERT INTO peca(tipo, modelo, specs, preco, watts_consumidos, link) VALUES
('Placa Mãe', 'ASUS ROG Strix Z790-E Gaming WIFI', 'LGA 1700, DDR5, PCIe 5.0', 3500.00, 50.0, 'link_z790'),
('Placa Mãe', 'Gigabyte B650 GAMING X AX V2', 'AM5, DDR5, PCIe 5.0', 1600.00, 40.0, 'link_b650'),
('Placa Mãe', 'MSI MAG B760 TOMAHAWK WIFI', 'LGA 1700, DDR5', 1300.00, 45.0, 'link_b760'),
('Placa Mãe', 'ASRock B550M Pro4', 'AM4, DDR4', 700.00, 35.0, 'link_b550m'),
('Placa Mãe', 'ASUS Prime H610M-E D4', 'LGA 1700, DDR4', 600.00, 30.0, 'link_h610m');

INSERT INTO peca(tipo, modelo, specs, preco, watts_consumidos, link) VALUES
('Memória RAM', 'Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz', 'CL30, Dual Channel', 1200.00, 10.0, 'link_ddr5-6000'),
('Memória RAM', 'Kingston Fury Beast 16GB (2x8GB) DDR4 3200MHz', 'CL16, Dual Channel', 350.00, 5.0, 'link_ddr4-3200'),
('Memória RAM', 'G.Skill Trident Z5 RGB 64GB (2x32GB) DDR5 6400MHz', 'CL32, High Performance', 2500.00, 15.0, 'link_ddr5-6400'),
('Memória RAM', 'Crucial Ballistix 8GB DDR4 2666MHz', 'CL16, Single Stick', 150.00, 3.0, 'link_ddr4-2666'),
('Memória RAM', 'XPG Spectrix D50 32GB (2x16GB) DDR4 3600MHz', 'CL18, Dual Channel', 500.00, 8.0, 'link_ddr4-3600');

INSERT INTO peca(tipo, modelo, specs, preco, watts_consumidos, link) VALUES
('Armazenamento', 'Samsung 990 Pro 2TB NVMe SSD', 'PCIe 4.0, Velocidade de leitura 7450 MB/s', 1100.00, 6.0, 'link_990-pro'),
('Armazenamento', 'Kingston NV2 1TB NVMe SSD', 'PCIe 4.0, Velocidade de leitura 3500 MB/s', 450.00, 4.0, 'link_nv2-1tb'),
('Armazenamento', 'Seagate Barracuda 4TB HDD', '7200 RPM, SATA 6Gb/s', 600.00, 10.0, 'link_hdd-4tb'),
('Armazenamento', 'Crucial P5 Plus 500GB NVMe SSD', 'PCIe 4.0', 250.00, 3.0, 'link_p5-plus'),
('Armazenamento', 'Western Digital Blue 1TB SATA SSD', 'SATA III, Velocidade de leitura 560 MB/s', 300.00, 2.0, 'link_wd-blue-sata');

INSERT INTO peca(tipo, modelo, specs, preco, watts_consumidos, link) VALUES
('Fonte', 'Corsair HX1200', '1200W, 80 PLUS Platinum, Modular', 1500.00, 0.0, 'link_hx1200'),
('Fonte', 'Super Flower Leadex III ARGB', '850W, 80 PLUS Gold, Modular', 900.00, 0.0, 'link_850w-gold'),
('Fonte', 'Cooler Master MWE Bronze V2', '650W, 80 PLUS Bronze', 450.00, 0.0, 'link_650w-bronze'),
('Fonte', 'Gigabyte GP-UD1000GM', '1000W, 80 PLUS Gold, Modular', 1200.00, 0.0, 'link_1000w-gold'),
('Fonte', 'EVGA 450 BR', '450W, 80 PLUS Bronze', 300.00, 0.0, 'link_450w-bronze');

SET SQL_SAFE_UPDATES = 0;

UPDATE peca SET link_imagem = 'https://www.gigantec.com.br/media/wysiwyg/processador-intel-core-i7-14700k-14-geracao-33mb-cache-lga-1700-bx8071514700k-001_1.png'
WHERE modelo = 'Intel Core i7-14700K';

UPDATE peca SET link_imagem = 'https://img.terabyteshop.com.br/produto/g/processador-amd-ryzen-7-7700x-45ghz-54ghz-turbo-8-cores-16-threads-am5-100-100000591wof_151060.png'
WHERE modelo = 'AMD Ryzen 7 7700X';

UPDATE peca SET link_imagem = 'https://hotsite.pichau.com.br/descricao/pc/CDN%20PROVSRIO/14400.png'
WHERE modelo = 'Intel Core i5-13400F'; 

UPDATE peca SET link_imagem = 'https://images.kabum.com.br/produtos/fotos/sync_mirakl/355263/xlarge/Processador-AMD-Ryzen-5-5600-3-5GHz-4-4GHz-Turbo-AM4-100-100000927BOX_1756303186.png'
WHERE modelo = 'AMD Ryzen 5 5600';

UPDATE peca SET link_imagem = 'https://i0.wp.com/playtech.lk/wp-content/uploads/2025/02/200.png?fit=500%2C500&ssl=1'
WHERE modelo = 'Intel Core i9-14900K';

UPDATE peca SET link_imagem = 'https://asset.msi.com/resize/image/global/product/product_1665552671c76199be0956de9b63d7e35b33b91acb.png62405b38c58fe0f07fcef2367d8a9ba1/1024.png'
WHERE modelo = 'NVIDIA GeForce RTX 4090';

UPDATE peca SET link_imagem = 'https://netshopinformatica.com.br/uploads/product_commerce/products/3579/image/w8-78d840.png'
WHERE modelo = 'AMD Radeon RX 7900 XT';

UPDATE peca SET link_imagem = 'https://img.terabyteshop.com.br/produto/g/placa-de-video-gigabyte-nvidia-geforce-rtx-4060-ti-gaming-16gb-gddr6-dlss-ray-tracing-gv-n406tgaming-16gd_189650.png'
WHERE modelo = 'NVIDIA GeForce RTX 4060 Ti';

UPDATE peca SET link_imagem = 'https://hotsite.pichau.com.br/descricao/Asus/DUAL-RX%206600%20XT/RX6600XT1.png'
WHERE modelo = 'AMD Radeon RX 6600';

UPDATE peca SET link_imagem = 'https://static.gigabyte.com/StaticFile/Image/Global/5ec9749269aa3bd50c88153c1d59e061/Product/21766/Png'
WHERE modelo = 'NVIDIA GeForce GTX 1650';

UPDATE peca SET link_imagem = 'https://dlcdnwebimgs.asus.com/files/media/B51D103D-2941-412E-8479-AF994957093B/v1/img/kv/ROG-Strix-X670E-E-Gaming.png'
WHERE modelo = 'ASUS ROG Strix Z790-E Gaming WIFI';

UPDATE peca SET link_imagem = 'https://images.kabum.com.br/produtos/fotos/sync_mirakl/452808/xlarge/Placa-M-e-Gigabyte-B650m-Gaming-X-Ax-AMD-AM5-Micro-Atx-DDR5_1744237244.png'
WHERE modelo = 'Gigabyte B650 GAMING X AX V2';

UPDATE peca SET link_imagem = 'https://storage-asset.msi.com/global/picture/image/feature/mb/B760/mag-b760-tomahawk-wifi/kv-pd.png'
WHERE modelo = 'MSI MAG B760 TOMAHAWK WIFI';

UPDATE peca SET link_imagem = 'https://www.asrock.com/mb/photo/B550M%20Pro4(M1).png'
WHERE modelo = 'ASRock B550M Pro4';

UPDATE peca SET link_imagem = 'https://dlcdnwebimgs.asus.com/gain/20bed294-a690-4e84-a06f-46e9a7b5472d/'
WHERE modelo = 'ASUS Prime H610M-E D4';

UPDATE peca SET link_imagem = 'https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Memory/vengeance-rgb-ddr5-wht-config/Gallery/Vengeance-RGB-DDR5-2UP-WHITE_10.webp'
WHERE modelo = 'Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz';

UPDATE peca SET link_imagem = 'https://www.gskill.com/_upload/images/2110201626450.png'
WHERE modelo = 'Kingston Fury Beast 16GB (2x8GB) DDR4 3200MHz';

UPDATE peca SET link_imagem = 'https://cdn.dooca.store/559/products/1-43.png?v=1709217103&webp=0'
WHERE modelo = 'G.Skill Trident Z5 RGB 64GB (2x32GB) DDR5 6400MHz';

UPDATE peca SET link_imagem = 'https://img.terabyteshop.com.br/archive/1127028911/memoria-crucial-ballistix-8gb-01.png'
WHERE modelo = 'Crucial Ballistix 8GB DDR4 2666MHz';

UPDATE peca SET link_imagem = 'https://img.terabyteshop.com.br/archive/2869043490/1.png'
WHERE modelo = 'XPG Spectrix D50 32GB (2x16GB) DDR4 3600MHz';

UPDATE peca SET link_imagem = 'https://images.samsung.com/is/image/samsung/p6pim/br/mz-v9p2t0bw/gallery/br-990pro-nvme-m2-ssd-mz-v9p2t0bw-538082421?$Q90_1248_936_F_PNG$'
WHERE modelo = 'Samsung 990 Pro 2TB NVMe SSD';

UPDATE peca SET link_imagem = 'https://cdn.awsli.com.br/2500x2500/2615/2615940/produto/269309929/ssd-1tb-1-eka1c81sjr.png'
WHERE modelo = 'Kingston NV2 1TB NVMe SSD';

UPDATE peca SET link_imagem = 'https://img.terabyteshop.com.br/archive/869088271/hd-seagate-barracuda-4tb-01.png'
WHERE modelo = 'Seagate Barracuda 4TB HDD';

UPDATE peca SET link_imagem = 'https://lv4tech.com/wp-content/uploads/2023/09/p5p500g-2.png'
WHERE modelo = 'Crucial P5 Plus 500GB NVMe SSD';

UPDATE peca SET link_imagem = 'https://shop.sandisk.com/content/dam/store/en-us/assets/products/internal-storage/wd-blue-sa510-sata-2-5-ssd/gallery/wd-blue-sa510-sata-2-5-ssd-1TB-front.png.thumb.1280.1280.png'
WHERE modelo = 'Western Digital Blue 1TB SATA SSD';

UPDATE peca SET link_imagem = 'https://assets.corsair.com/image/upload/f_auto,q_auto/content/CP-9020140-CN-HX1200-01.png'
WHERE modelo = 'Corsair HX1200';

UPDATE peca SET link_imagem = 'https://img.terabyteshop.com.br/produto/g/fonte-super-flower-leadex-iii-argb-750w-80-plus-gold-pfc-ativo-full-modular-white-sf-750f14rgwh_120913.png'
WHERE modelo = 'Super Flower Leadex III ARGB';

UPDATE peca SET link_imagem = 'https://cdn.awsli.com.br/2500x2500/763/763482/produto/324141420/fonte-cooler-master-mwe-v2-700w-80-plus-bronze-pfc-ativo-mpe-7001-acaab-br_10483-ebhqnkvzdf.png'
WHERE modelo = 'Cooler Master MWE Bronze V2';

UPDATE peca SET link_imagem = 'https://www.jumbo-computer.com/cdn/shop/files/1000_101ec09f-a2c7-4c32-b544-15999e04ee65_800x.webp?v=1691917614'
WHERE modelo = 'Gigabyte GP-UD1000GM';

UPDATE peca SET link_imagem = 'https://static.wixstatic.com/media/fd13eb_cbc8efa8a26b428d90158a65f8d08b96~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/fd13eb_cbc8efa8a26b428d90158a65f8d08b96~mv2.png'
WHERE modelo = 'EVGA 450 BR';

UPDATE peca SET watts_consumidos = 1200 
WHERE modelo LIKE 'Corsair HX1200';

UPDATE peca SET watts_consumidos = 750 
WHERE modelo LIKE 'Super Flower Leadex';

UPDATE peca SET watts_consumidos = 700 
WHERE modelo LIKE 'Cooler Master MWE';

UPDATE peca SET watts_consumidos = 1000 
WHERE modelo LIKE 'Gigabyte GP-UD1000GM';

UPDATE peca SET watts_consumidos = 450 
WHERE modelo LIKE 'EVGA 450 BR';


