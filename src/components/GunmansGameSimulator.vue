<template>
  <div>
    <section class="container">
      <h2 class="title">Game Options</h2>
      <div class="columns">
        <b-checkbox v-model="flexibleRate" class="column">
          Flexible Rate Setting
        </b-checkbox>
      </div>
      <div class="columns">
        <b-field label="Number of Turns" class="column">
          <b-numberinput v-model="turns" :min="players" :max="10" size="is-large" :step="1" lazy
                         @input="render"/>
        </b-field>
        <b-field label="Number of players" class="column">
          <b-numberinput v-model="players" :min="2" :max="Math.min(5, turns)" size="is-large" :step="1" lazy
                         @input="render"/>
        </b-field>
      </div>
      <div class="columns">
        <b-field v-for="i in rateLength" v-bind:key="i" :label="'Hit Rate of ' + (flexibleRate ? 'Turn' : 'Player') + i" class="column">
          <b-slider v-model="rate[i-1]" :min="0.00" :max="1.00" :step="0.01" lazy @change="render"
                    type="is-info"/>
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
    import {Network} from 'vis-network';

    export default {
        name: "GunmansGameSimulator",
        components: {

        },
        data() {
            return {
                players: 3,
                turns: 3,
                rate: [0.3, 0.5, 1.0, 1.0, 1.0, 0.3, 0.5, 1.0, 1.0, 1.0],
                flexibleRate: false,
                status: 'Not yet calculated',
                options: {
                    layout: {hierarchical: true},
                    physics: {enabled: false},
                },
                simulator: null,
            }
        },
        computed: {
            rateLength() {
                return this.flexibleRate ? this.turns : this.players;
            },
            simulatorOption() {
                return new GameOption(
                    this.players,
                    this.turns,
                    this.rate.slice(0, this.rateLength),
                );
            },
        },
        methods: {
            render: function () {
                this.status = "Processing... This may take a while.";
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
    border: solid 2px #9b67df;
  }
</style>
