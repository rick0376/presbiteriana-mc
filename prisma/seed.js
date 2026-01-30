const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  const igreja = await prisma.igreja.findFirst();

  if (!igreja) {
    throw new Error("Nenhuma igreja encontrada. Crie uma igreja primeiro.");
  }

  const firstNames = [
    "João",
    "Maria",
    "José",
    "Ana",
    "Paulo",
    "Lucas",
    "Marcos",
    "Mateus",
    "Pedro",
    "Tiago",
    "Rafael",
    "Bruno",
    "Felipe",
    "Carlos",
    "Daniel",
    "Gabriel",
    "Vinícius",
    "Diego",
    "André",
    "Fernando",
    "Juliana",
    "Camila",
    "Fernanda",
    "Patrícia",
    "Aline",
    "Beatriz",
    "Larissa",
    "Mariana",
    "Carolina",
    "Letícia",
  ];

  const lastNames = [
    "Silva",
    "Souza",
    "Oliveira",
    "Santos",
    "Lima",
    "Pereira",
    "Ferreira",
    "Costa",
    "Rodrigues",
    "Almeida",
    "Nunes",
    "Carvalho",
    "Gomes",
    "Ribeiro",
    "Martins",
    "Araújo",
    "Barbosa",
    "Melo",
    "Cardoso",
    "Teixeira",
  ];

  const cargos = ["ADMIN", "PASTOR", "SECRETARIO", "TESOUREIRO", "MEMBRO"];

  const hoje = new Date();
  const total = 50;

  const membros = Array.from({ length: total }).map((_, i) => {
    let dataVencCarteirinha = null;

    if (i < Math.floor(total * 0.35)) {
      // vencidos
      dataVencCarteirinha = randomDate(
        new Date(hoje.getFullYear() - 1, 0, 1),
        new Date(hoje.getTime() - 86400000),
      );
    } else if (i < Math.floor(total * 0.7)) {
      // vence em 30 dias
      dataVencCarteirinha = randomDate(
        hoje,
        new Date(hoje.getTime() + 30 * 86400000),
      );
    } else {
      // ok
      dataVencCarteirinha = randomDate(
        new Date(hoje.getTime() + 31 * 86400000),
        new Date(hoje.getTime() + 365 * 86400000),
      );
    }

    const nome = `${pick(firstNames)} ${pick(lastNames)}`;

    return {
      igrejaId: igreja.id,
      nome,
      cargo: cargos[i % cargos.length],
      telefone: `1199999${String(1000 + i)}`,
      numeroCarteirinha: `CAR-${1000 + i}`,
      dataNascimento: randomDate(new Date(1960, 0, 1), new Date(2005, 0, 1)),
      dataBatismo: randomDate(new Date(2000, 0, 1), new Date(2024, 0, 1)),
      dataCriacaoCarteirinha: randomDate(new Date(2023, 0, 1), hoje),
      dataVencCarteirinha,
      observacoes: "Membro gerado via seed",
    };
  });

  await prisma.membro.createMany({ data: membros });

  console.log(`✅ ${total} membros criados com sucesso`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
