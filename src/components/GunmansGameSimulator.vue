<template>
  <div>
    <section class="container">
      <h2 class="title">Game Options</h2>
      <div class="columns">
        <b-field label="Number of Turns" class="column">
          <b-slider v-model="turns" :min="1" :max="10" :step="1" lazy @change="render"></b-slider>
        </b-field>
        <!-- b-field label="Number of players">
          <b-slider v-model="players" :min="1" :max="5" :step="1" lazy disabled></b-slider>
        </b-field -->
      </div>
      <div class="columns">
        <b-field label="Hit Rate of Player1" class="column">
          <b-slider v-model="rate[0]" :min="0.00" :max="1.00" :step="0.01" lazy @change="render" type="is-info"></b-slider>
        </b-field>
        <b-field label="Hit Rate of Player2" class="column">
          <b-slider v-model="rate[1]" :min="0.00" :max="1.00" :step="0.01" lazy @change="render" type="is-success"></b-slider>
        </b-field>
        <b-field label="Hit Rate of Player3" class="column">
          <b-slider v-model="rate[2]" :min="0.00" :max="1.00" :step="0.01" lazy @change="render" type="is-danger"></b-slider>
        </b-field>
      </div>
      <div class="columns">
        <b-message type="is-info" class="column">
          Result: {{status}}
        </b-message>
      </div>
    </section>
    <section class="container">
      <h2 class="title">Game Tree Visualization</h2>
      <div id="graph-container" class="container"></div>
    </section>
  </div>
</template>

<script>
    import {GameState, GameOption, formatGain} from "../assets/simulator";
    import {Network} from 'vis-network'

    export default {
        name: "GunmansGameSimulator",
        data() {
            return {
                players: 3,
                turns: 3,
                rate: [0.3, 0.5, 1.0],
                status: 'Not yet calculated',
                options: {
                    layout: {hierarchical: true},
                    physics: {enabled: false},
                },
                simulator: null,
            }
        },
        computed: {
            simulatorOption() {
                return new GameOption(this.players, this.turns, this.rate);
            },
        },
        methods: {
            render: function () {
                const nodes = [];
                const edges = [];
                this.simulator = new GameState(this.simulatorOption, 0, Array(this.players).fill(true));
                this.simulator.build(nodes, edges);

                if (this.network) this.network.destroy();
                this.network = new Network(
                    document.getElementById('graph-container'),
                    {nodes: nodes, edges: edges},
                    this.options,
                );
                //this.network.focus(this.simulator.id);
                this.status = `OK. (${formatGain(this.simulator.gain)})`;
            }
        },
        mounted() {
            this.render();
        }
    }
</script>

<style scoped>
  .container {
    margin-top: 32px;
    margin-bottom: 32px;
  }
  #graph-container {
    height: 80vh;
  }
</style>
