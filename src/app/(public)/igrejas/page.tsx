"use client";
import Link from "next/link";
import styles from "./styles.module.scss";
import { useState } from "react";
import { Radio, Volume2 } from "lucide-react";

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

  const [buildOpen, setBuildOpen] = useState(false);
  const [buildPage, setBuildPage] = useState("");

  function openBuildModal(pageName: string) {
    setBuildPage(pageName);
    setBuildOpen(true);
  }

  return (
    <div className={styles.home}>
      {/* BANNER */}
      <section className={styles.banner}>
        <div className={styles.bannerInner}>
          <div className={styles.bannerLeft}>
            <div className={styles.topActions}>
              <button
                type="button"
                className={styles.radioBtn}
                onClick={() => openBuildModal("Rádio / Oração ao vivo")}
              >
                <span className={styles.radioIcon}>
                  <Volume2 size={18} />
                </span>
                <span className={styles.radioText}>Rádio</span>
                <span className={styles.radioBadge}>EM BREVE</span>
              </button>
            </div>
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
              <button
                type="button"
                className={styles.btnGreen}
                onClick={() => openBuildModal("Eventos")}
              >
                Eventos
              </button>

              <button
                type="button"
                className={styles.btnRed}
                onClick={() => openBuildModal("Eventos")}
              >
                Cronograma
              </button>

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

              <button
                type="button"
                className={styles.btnVisit}
                onClick={() => openBuildModal(`Site da igreja: ${item.nome}`)}
              >
                Visitar Site
              </button>
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

      {buildOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setBuildOpen(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalIcon}>🚧</div>

            <h3 className={styles.modalTitle}>Página em construção</h3>

            <p className={styles.modalText}>
              A área de <strong>{buildPage}</strong> ainda está sendo
              desenvolvida.
            </p>

            <button
              type="button"
              className={styles.modalBtn}
              onClick={() => setBuildOpen(false)}
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
