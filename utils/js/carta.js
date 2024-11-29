class Carta {
  constructor(representacion) {
    this.representacion = representacion;
    this.valor = representacion.substring(0, representacion.length - 1);

    if (this.valor === "J" || this.valor === "Q" || this.valor === "K") {
      this.valor = 10;
    } else if (this.valor === "A") {
      this.valor = 11;
    } else {
      this.valor = parseInt(this.valor);
    }

    this.imagen = `images/${this.representacion}.png`;
  }

  toString() {
    return this.representacion;
  }
}
