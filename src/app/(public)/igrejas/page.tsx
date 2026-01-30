"use client";
import Link from "next/link";
import styles from "./styles.module.scss";
import { useState } from "react";

const igrejas = [
  {
    id: 1,
    nome: "IPRB - Presbiteriana Renovada",
    slug: "igreja-a",
    endereco: "Rua Rafael Popoaski, 130 - IPE I",
    imagem: "/images/igreja-a.png",
  },
];

export default function IgrejasPage() {
  const [imgOk, setImgOk] = useState(true);

  return (
    <div className={styles.home}>
      {/* BANNER */}
      <section className={styles.banner}>
        <div className={styles.bannerInner}>
          <div className={styles.bannerLeft}>
            <div className={styles.bannerTitle}>
              <img
                src="/images/logo_transparente.png"
                alt="Logo Igreja Matriz"
                className={styles.bannerLogo}
              />
              <h1>Igreja Presbiteriana Renovada </h1>
            </div>

            <p className={styles.bannerSubtitle}>
              Cultos as Quartas, Sexta e Domingos
            </p>

            <div className={styles.bannerButtons}>
              <Link href="/eventos" className={styles.btnGreen}>
                Eventos
              </Link>

              <Link href="/login" className={styles.btnBlue}>
                Acesso
              </Link>
            </div>

            <div className={styles.bannerInfos}>
              <div className={styles.infoItem}>
                <span className={styles.dot}></span>
                <p>Culto as 19:30 na Quarta / Sexta</p>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.dot}></span>
                <p>Culto as 19:15 no domingo</p>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.dot}></span>
                <p>Oração segunda, quarta e sexta as 8:00 hs e as 17:00 hs</p>
              </div>
            </div>
          </div>

          <div className={styles.bannerRight}>
            {imgOk ? (
              <img
                src="/images/pastor.png"
                alt="Pastor Presidente"
                onError={() => setImgOk(false)}
              />
            ) : (
              <div className={styles.imgFallback}>Sem imagem</div>
            )}
          </div>
        </div>
      </section>

      {/* CARDS */}
      <section className={styles.cards}>
        {igrejas.map((item) => (
          <div key={item.id} className={styles.card}>
            <div className={styles.cardTop}>
              <img src={item.imagem} alt={item.nome} />
            </div>

            <div className={styles.cardBody}>
              <h3>{item.nome}</h3>
              <p>{item.endereco}</p>

              <Link href={`/igrejas/${item.slug}`} className={styles.btnVisit}>
                Visitar Site
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* WHATSAPP FLUTUANTE */}
      <a
        href="https://wa.me/5512991890682"
        target="_blank"
        className={styles.whatsappFloat}
      >
        <span>💬</span>
      </a>
    </div>
  );
}
