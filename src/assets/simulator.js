export function formatGain(gain) {
    const copy = Array(gain.length);
    for (let i = 0; i < gain.length; i++) {
        copy[i] = gain[i].toFixed(2);
    }
    return copy.toString();
}

export function formatStatus(status) {
    let res = '{';
    for (let i = 0; i < status.length; i++) {
        if (!status[i]) continue;
        if (res.length > 1) res += ', ';
        res += (i + 1);
    }
    return res + '}';
}

export function formatRate(rate) {
    return `${Math.round(rate * 100)}%`;
}

export class GameOption {
    constructor(players, maxStep, rate) {
        this.players = players;
        this.maxStep = maxStep;
        if (maxStep === rate.length) {
            this.rate = rate;
        } else {
            this.rate = new Array(maxStep);
            for (let i = 0; i < maxStep; i++) this.rate[i] = rate[i % players];
        }
        this.rate = rate;
    }
}

export class GameState {
    constructor(option, step, status) {
        this.option = option;
        this.step = Math.min(step, option.maxStep);
        this.player = this.step % this.option.players;
        this.status = status;
        this.alive = 0;
        let hash = 0;
        for (let i = 0; i < option.players; i++) {
            hash *= 2;
            if (status[i]) {
                this.alive++;
                hash++;
            }
        }

        this.id = `${this.step}:${hash}:${Math.random().toString(36).slice(-8)}`;
        this.type = option.maxStep === this.step || this.alive === 1 ? 'result' : 'step';
    }

    build(nodes, edges) {
        if (this.type === 'result') {
            this.gain = new Array(this.option.players);
            for (let i = 0; i < this.option.players; i++) {
                this.gain[i] = this.status[i] ? 1.0 / this.alive : 0.0;
            }
            nodes.push({
                id: this.id,
                label: `${formatGain(this.gain)}\n${formatStatus(this.status)}`,
                group: -1,
                level: this.step * 2,
            });
            return;
        }

        let nextStep = this.step + 1;
        while (!this.status[nextStep % this.option.players]) nextStep++;

        const choices = [];
        const fail = new GameState(this.option, nextStep, this.status);
        fail.build(nodes, edges);
        const toFailEdge = {
            from: this.id,
            to: fail.id,
            label: 'PASS',
        };
        edges.push(toFailEdge);
        choices.push({
            gain: fail.gain,
            to: -1,
            edge: toFailEdge,
        });

        for (let i = 0; i < this.option.players; i++) {
            if (i === this.step % this.option.players || !this.status[i]) continue;
            const p = this.option.rate[this.step % this.option.rate.length];
            const detNodeID = `${this.id}:${i}`;
            const toDetEdge = {
                from: this.id,
                to: detNodeID,
                label: `KILL ${i + 1}`,
            };
            edges.push(toDetEdge);
            edges.push({
                from: detNodeID,
                to: fail.id,
                label: `${formatRate(1-p)}\nFAIL`,
                dashes: true,
            });

            const newStatus = this.status.concat();
            newStatus[i] = false;
            let nextStepAlive = nextStep;
            while (!newStatus[nextStepAlive % this.option.players]) nextStepAlive++;
            const success = new GameState(this.option, nextStepAlive, newStatus);
            success.build(nodes, edges);
            edges.push({
                from: detNodeID,
                to: success.id,
                label: `${formatRate(p)}\nOK`,
                dashes: true,
            });

            const newGain = [];
            for (let i = 0; i < this.option.players; i++) {
                newGain[i] = p * success.gain[i] + (1 - p) * fail.gain[i];
            }

            choices.push({
                gain: newGain,
                to: i,
                edge: toDetEdge,
            });
            nodes.push({
                id: detNodeID,
                label: formatGain(newGain),
                group: -2,
                level: this.step * 2 + 1,
            });
        }

        const me = this.player;
        choices.sort(function (x, y) {
            return y.gain[me] - x.gain[me];
        });
        this.gain = choices[0].gain;
        choices[0].edge.arrows = {to: true};
        nodes.push({
            id: this.id,
            label: `${formatGain(this.gain)}\n${formatStatus(this.status)}`,
            group: this.player,
            level: this.step * 2,
        });
    }
}
